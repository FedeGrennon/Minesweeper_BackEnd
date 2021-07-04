module.exports = class Response
{
    constructor(body, statusCode, description = '')
    {
        this.Body = body;
        this.StatusCode = statusCode;
        this.Description = description;
    }
}