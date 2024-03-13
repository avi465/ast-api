const modelResolver = (value) => {
    switch (value) {
        case 'user':
            return require('../models/User');
        case 'seller':
            return require('../models/Seller');
        case 'product':
            return require('../models/Product');
        default:
            return null;
    }
}

module.exports = modelResolver;