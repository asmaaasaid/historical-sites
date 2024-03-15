const errorGlobal = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV == 'development'){
        developmentErrorHandling(err, res);
    }else {
        productionErrorHandlling(err, res);
    }

};

// Handlling Error that will be send in the development mode
const developmentErrorHandling = (err, res) =>{
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// Handlling Error that will be send in the production mode
const productionErrorHandlling = (err, res) =>{
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
       
    });
};


module.exports = errorGlobal;