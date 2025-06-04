export const successRes = (res, resData, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message: 'success',
        data: resData
    });
}