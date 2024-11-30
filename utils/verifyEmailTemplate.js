const verifyEmailTemplate = ({name, url}) => {
    return`
    <p>thank you for registering BlinkeyIt Dear ${name}</p>
    <button style="color:white; background:blue; margin-top:10px; "><a href="${url}">Verify Email</a></button>
    `
}

export default verifyEmailTemplate;