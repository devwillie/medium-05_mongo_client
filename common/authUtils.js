import { getClientDetails } from '../services/ClientService';
import uuid from 'uuid';

const newSessionRoutes = [{ path: '/user/login', method: 'POST'}];
const authRoutes = [{ path: '/user/password', method: 'PUT'}];

export const isNewSessionRequired = (httpMethod, url) => {
    for (let routeObj of newSessionRoutes) {
        if (routeObj.method === httpMethod && routeObj.path === url){
            return true;
        }

    }

    return false;
}

export const isAuthRequired = (httpMethod, url) => {
    for (let routeObj of authRoutes){
        if (routeObj.method === httpMethod && routeObj.path === url) {
            return true;
        }
    }

    return false;
}

export const generateRandomSessionID = () => {
    return uuid.v4();
}

export const clientApiKeyValidation = async (req, res, next) => {

    let clientApiKey = req.get('api_key');

    if (!clientApiKey) {
        return res.status(400).send({
            status: false,
            response: "Missing Api Key"
        })
    }

    try {
        let clientDetails = await getClientDetails(req.db, clientApiKey);
        if (clientDetails) {
            next();
        }
    } catch (e) {
        console.log('%%%%%%%% error :', e);
        return res.status(400).send({
            status: false,
            response: "Invalid Api Key"
        })
    }

}