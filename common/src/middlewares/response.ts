interface Iresponse {
    message?: string,
    result?: any,
    page?: number,
    total?: number
}
function responseSuccess(data?: Iresponse) {
    return {
        success: true,
        page: data?.page,
        total: data?.total,
        message: data?.message || "success",
        data: data?.result,
    };
}
function responseFail(data?: Iresponse) {
    return {
        success: false,
        page: data?.page,
        total: data?.total,
        message: data?.message || "Fail",
        data: data?.result,
    };
}
export { responseFail, responseSuccess };
