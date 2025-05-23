import config from '../config/index';
import {connectLibrary} from '../../db/prisma-clients';
const fs = require('fs');
const path =require('path')
import { Prisma } from '@prisma/client';
const fetchEmailContent = async(subjectkey, language,keyDatas:any = null,partyConfig = null) =>{
    console.log({
      subjectkey,keyDatas,language
    })
    let configData, defaultConfig,allFields;
  
    
    try {
      console.log("partyConfig",partyConfig);

      defaultConfig = partyConfig || JSON.parse(config.DEFAULT_CONFIG);
      console.log("defaultConfig",defaultConfig);
      
      // Query to get the email template based on the key and language
      
     
      const emailRslt = await connectLibrary.$queryRaw<any[]>(
        Prisma.sql`
          SELECT avms.cid, avms.content, avms.subject 
          FROM applicationversionmail_spr AS avms
          INNER JOIN spr AS s ON avms.fk_spr = s.cid 
          INNER JOIN applicationversion_mail AS avm ON avm.cid = avms.fk_applicationversionmail
          INNER JOIN application_version apv ON apv.cid = avm.fk_applicationversion
          INNER JOIN application app ON app.cid = apv.fk_application
          WHERE s.code = ${language.toUpperCase()} AND avm.key = ${subjectkey} AND app.code = 'BEXIO'
        `
      );
      


      
      if (emailRslt.length === 0) {
        throw new Error('No email template found');
      }
      const domainName = defaultConfig.domain;
   


      const getConfigRslt = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        SELECT 
          config->>'domain' AS domainname,
          config AS configdata
        FROM 
          public.commissionagent 
        WHERE config->>'domain' = ${domainName}
          AND config IS NOT NULL
      `);

      if( getConfigRslt.length != 0 ){
        configData = getConfigRslt[0].configdata;
      }
      else{
        configData = JSON.parse(config.DEFAULT_CONFIG);
      }
      let commonFields = await getCommonFields(configData);
      // Define common fields for replacement
      // Prepare email fields
      // let allFields = keyDatas ? { ...commonFields, ...keyDatas } : commonFields;
      let allFields: Record<string, any> = {
        ...commonFields,
        ...(keyDatas && typeof keyDatas === 'object' && !Array.isArray(keyDatas) ? keyDatas : {})
      };
      
      
    
      
      // Replace common fields and keyDatas in the email template
      const emailTemplate = emailRslt[0].content;
      const filledTemplate = replaceCommonFields(emailTemplate, allFields);
      console.log("filledTemplate ",filledTemplate+' ' +subjectkey)
      return {
          message: filledTemplate,
          subject: emailRslt[0].subject
      };
    } catch (error) {
      console.error("//----------------------------//");
      console.error(error);
      console.error("//----------------------------//");
      throw error;
    }    

}
const getCommonFields = async (configData) =>{
  const product_logo_imagePath = configData.images?.product_logo?.filePath || configData.images?.account_logo?.filePath;
  const company_logo_imagePath = configData.images?.host_company_logo?.filePath || configData.images?.light_theme?.filePath;
  const product_logo = configData?.accounts_api_url+`auth/fetchImages?imageurl=${product_logo_imagePath}`;
  const company_logo = configData?.accounts_api_url+`auth/fetchImages?imageurl=${company_logo_imagePath}`;
  return {
    product_logo: product_logo,
    logo_title: 'Gate2b Logo',
    sales_contact: configData?.sales_team_contact,
    helpdesk_contact: configData?.help_desk_contact,
    host_company: configData?.company_name,
    company_logo: company_logo,
    company_logo_title: configData?.company_name,
    current_year: new Date().getFullYear(),
    twitter_link: configData?.socialmedia?.twitter_link,
    twitter_logo: configData?.socialmedia?.twitter_logo || 'https://accounts.io-market.net/assets/img/template/twitter.png',
    twitter_title: configData?.socialmedia?.twitter_title,
    fb_link: configData?.socialmedia?.facebook_link,
    fb_logo: configData?.socialmedia?.fb_logo || 'https://accounts.io-market.net/assets/img/template/facebook.png',
    fb_title: configData?.socialmedia?.facebook_title,
    linkedin_link: configData?.socialmedia?.linkedin_link,
    linkedin_title: configData?.socialmedia?.linkedin_title,
    linkedin_logo: configData?.socialmedia?.linkedin_logo || 'https://accounts.io-market.net/assets/img/template/linked-in.png',
    contactus_link: configData?.contactus_link || 'mailto:office@io-market.com',
    theme_color: configData?.theme_color || 'rgba(139, 150, 53, 1)',
    contactus_image: configData?.contactus_image || 'https://accounts.io-market.net/assets/img/template/support_agent.png'
  };
}
const replaceCommonFields = (template, fields) => {
    let output = template;
    for (const [key, value] of Object.entries(fields)) {
        const placeholder = `[${key}]`;
        output = output.split(placeholder).join(value ?? '');
    }

    return output;
};

export default fetchEmailContent