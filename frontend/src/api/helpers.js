// use this to get the profile picture URL of the user
export function getProfilePictureUrl(){
    const profilePicture = localStorage.getItem("profilePicture")
    if (profilePicture){
        return new URL(profilePicture);
    }
    else{
        return new URL("https://no.profile.picture");
    }
}


export function isPresignedUrlExpired(url) {
    const urlObj = new URL(url);

    // Extract the X-Amz-Date and X-Amz-Expires parameters
    const amzDate = urlObj.searchParams.get('X-Amz-Date');
    const amzExpires = urlObj.searchParams.get('X-Amz-Expires');

    if (!amzDate || !amzExpires) {
        throw new Error("URL does not contain the necessary AWS presigned parameters.");
    }

    // Parse the X-Amz-Date parameter (format: YYYYMMDDTHHmmssZ)
    const expirationDate = new Date(
        Date.UTC(
            parseInt(amzDate.slice(0, 4)),      // Year
            parseInt(amzDate.slice(4, 6)) - 1,  // Month (0-indexed)
            parseInt(amzDate.slice(6, 8)),      // Day
            parseInt(amzDate.slice(9, 11)),     // Hour
            parseInt(amzDate.slice(11, 13)),    // Minute
            parseInt(amzDate.slice(13, 15))     // Second
        )
    );

    // Add the X-Amz-Expires value (in seconds) to the expiration date
    const expirationTimeInSeconds = parseInt(amzExpires);
    expirationDate.setSeconds(expirationDate.getSeconds() + expirationTimeInSeconds);
    // console.log("Expiration date: " + expirationDate)

    // Compare the expiration date with the current date
    const currentDate = new Date();
    // console.log("Current date: " + currentDate);
    return currentDate > expirationDate;
}