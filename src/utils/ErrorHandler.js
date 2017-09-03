exports.throwError = function (res, error) {
	if (error.status) {
		return res.status(error.status).json({
			success: false,
			data: error.message
		});
	}
	
	return res.status(500).json({
		success: false,
		data: error
	});
};
