import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export enum TOAST_TYPE {
    SUCCESS,
    ERROR,
    INFO,
}

interface ToastUtilParams {
    status: TOAST_TYPE,
    message ?: string
}

export const showToastUtil = (params: ToastUtilParams) => {
    const { status, message } = params;
    switch (status) {
        case TOAST_TYPE.SUCCESS:
            const successMsg = message ?? 'Success!'
            toast.success(successMsg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });        
            break;
        case TOAST_TYPE.INFO:
            const infoMsg = message ?? 'DAIM!'
            toast.success(infoMsg, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });        
            break;
        case TOAST_TYPE.ERROR:
        default:
            let errorMsg = message ?? 'Sorry! Encountered an error.\nPlease check inputs and try again.'
            toast.error(errorMsg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });        
            break;
    }
}
