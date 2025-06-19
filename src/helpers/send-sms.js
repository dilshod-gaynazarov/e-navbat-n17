import axios from "axios";

export const sendSMS = async (phoneNumber, message) => {
    const options = {
        method: 'POST',
        url: 'https://sms.codearch.uz/api/v1/sendMessage',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        data: {
            "api_key": "7486e6af-b163-4b54-8676-94b3d738dda5",
            "phone": phoneNumber,
            "message": message
        }
    };
    const {data} = await axios.request(options);
    console.log(data);
}