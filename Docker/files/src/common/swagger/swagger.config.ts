const customfavIcon = "faicon image url"; // Adding favicon to Swagger

const customCss = `
    .topbar{
        animation: navanimation linear both;
        animation-range: 0 300px;
        animation-timeline: scroll(root);
        position: sticky;
        top: 0px;
        z-index: 1;
    }
    .topbar-wrapper {
        content: 'Bexio API'; color: white;
    }  
    .topbar-wrapper a {
        content:url(https://header image url); width:200px; height:auto;
    }
    .swagger-ui .opblock .opblock-summary-description { 
        font-weight: 900;
    }
    .description .renderedMarkdown p {
        font-size: 1rem;
    }
    @keyframes navanimation {
        to {
            opacity: 0.9;
            backdrop-filter: blur(10px);
        }
    }
`;

const customSiteTitle = "Bexio Interface API Service"; // Updated site title for Swagger SEO

const swaggerOptions = {
    // customfavIcon,
    // customCss,
    customSiteTitle,
    swaggerOptions: {
        persistAuthorization: true, // Retains token even after refreshing Swagger UI
        // defaultModelsExpandDepth: -1 // Uncomment to hide schema models by default
    },
};

const swaggerTitle = "Bexio Interface API Service Documentation";

const swaggerDescription = `
  <p>This API service serves as an interface for integrating with Bexio, offering seamless communication between applications and the Bexio business platform.</p>
  <p>It provides robust and secure endpoints for managing invoices, contacts, items, and other business operations via REST API.</p>
  <p>Key features of this API service include:</p>
  <ul>
    <li>Secure OAuth2-based Authentication</li>
    <li>CRUD Operations for Invoices, Contacts, and Products</li>
    <li>Seamless Integration with Bexio API Endpoints</li>
    <li>Pagination and Filtering Support</li>
  </ul>
`;

export {
    swaggerOptions,
    swaggerTitle,
    swaggerDescription
};
