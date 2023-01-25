var LinkToPlayer = function(props) {
    if (props.includes("https://") || props.includes("http://")) {
        let domain = new URL(props);
        let host = domain.hostname.toLocaleLowerCase();
        let readyToSend;
        switch (host) {
            case 'cda.pl':
                readyToSend = "CDA";
                break;
            case 'ebd.cda.pl':
                readyToSend = "CDA";
                break;
            case 'drive.google.com':
                readyToSend = "GOOGLE DRIVE";
                break;
            case 'mega.nz':
                readyToSend = "MEGA"
                break;
            default:
                readyToSend = null;
        }
        return readyToSend;
    } else {
        return null;
    }
}
export default LinkToPlayer;