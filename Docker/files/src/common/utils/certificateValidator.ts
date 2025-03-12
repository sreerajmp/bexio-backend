
const certificateValidtion = async (req,res,next) =>{
    console.log("stareted middleware here");
    const cert = req.socket.getPeerCertificate();
    console.log("cert",cert);
	if (req.client.authorized) {
        console.log("success ",req.client.authorized);
		// res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`);
        next()

	} else if (cert.subject) {
        console.log("unauthorized ",cert.subject);
        return res.status(403).json({
            status: 'fail',
            message: 'unauthorized',
          });

	} else {
        console.log("no certificate found");
        return res.status(401).json({
            status: 'fail',
            message: 'Sorry, but you need to provide a client certificate to continue',
          });
	}
    
}
module.exports = certificateValidtion
