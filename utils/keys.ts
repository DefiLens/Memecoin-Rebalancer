const getBaseURL = (NODE_ENV: string | undefined) => {
    switch (NODE_ENV) {
        case 'production':
            return 'https://memecoin-backend.onrender.com/api';

        case 'staging':
            return 'https://memecoin-backend.onrender.com/api';

        case 'dev':
            return 'http://localhost:4500/api';

        default: return 'http://localhost:4500/api';
    }
};

export const BASE_URL = getBaseURL(process.env.NEXT_PUBLIC_NODE_ENV);