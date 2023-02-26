const playerChecking = function(props) {
    if(props.includes("https://") || props.includes("http://")){
        let domain = (new URL(props));
        let host = domain.hostname.replace('www.','').toLocaleLowerCase();
        
        let readyToSend;
        switch (host) {
            case 'cda.pl':

                readyToSend = {
                    status: true,
                    name: "CDA"
                };
                break;
            case 'ebd.cda.pl':

                readyToSend = {
                    status: true,
                    name: "CDA"
                };
                break;
            case 'drive.google.com':
                readyToSend = {
                    status: true,
                    name: "GOOGLE DRIVE"
                };
                break;
            case 'mega.nz':
                readyToSend = {
                    status: true,
                    name: "MEGA"
                };
                break;
            default:
                readyToSend = null;
        }
        
        return (readyToSend);
    }else{
        return(null)
    }
}
export default playerChecking;