const {ZodError} = require("zod")

const validate = (schema, source = "body") => {
    return async (req, res, next)=> {
        try {
        const toValid = source === "params" ? req.params : req.body;
        const parsed = await schema.parseAsync(toValid)
        
        if(source === "params") req.params  = parsed
        else req.body = parsed

        next()

        } catch (error) {
            if(error instanceof ZodError) {
                const issues = error.errors.map(e => ({
                    path : e.path.join("."),
                    message: e.message
                }))
                return res.status(401).json({error : "Validation error", issues});
            }
            next(err);
        }
    }

}

module.exports = validate