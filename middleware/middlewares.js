export const globalErr = (err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500).json({ errors: [{ msg: `❌ Error: ${err.message}` }] });
};