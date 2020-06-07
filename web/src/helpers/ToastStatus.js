import { toast } from 'react-toastify';

export default async function (action, successMessage, errorMessage) {
    try {
        var result = await action();
        if (successMessage)
            toast.success(successMessage, { position: "bottom-left" });
        return result;
    } catch (error) {
        console.error(error);
        toast.error(`${errorMessage ? (errorMessage + ". ") : ""}Check the console for more details.`, { position: "bottom-left" });
        throw error;
    }
}