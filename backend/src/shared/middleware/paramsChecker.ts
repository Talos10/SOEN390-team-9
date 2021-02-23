import { Request, Response, NextFunction } from 'express';

const requireParams = (params: Array<string>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const reqParamList = Object.keys(req.body);
    const hasAllRequiredParams = params.every(param => reqParamList.includes(param));
    if (!hasAllRequiredParams) {
        return res.status(400).json({
            status: false,
            error: 'The following parameters are all required for this route: ' + params.join(', ')
        });
    }
    next();
};

const stringIsNotNUllUndefineEmpty = (params: Array<string>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const reqParamList = Object.values(req.body);
    const isOk = reqParamList.every(param => !!param);
    if (!isOk) {
        return res.status(400).json({
            status: false,
            error: 'The following parameters need a value: ' + params.join(', ')
        });
    }
    next();
};

export { requireParams, stringIsNotNUllUndefineEmpty as isNotNUllUndefinedEmpty };
