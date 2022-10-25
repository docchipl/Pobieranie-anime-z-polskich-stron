const playerChecking = function(props) {
    if(props.includes("https://") || props.includes("http://")){
        let domain = (new URL(props));
        let host = domain.hostname.replace('www.','').toLocaleLowerCase();
        
        let readyToSend;
        switch (host) {
            case 'cda.pl':

                readyToSend = true;
                break;
            case 'ebd.cda.pl':

                readyToSend = true;
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