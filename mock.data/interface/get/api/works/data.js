module.exports = function (json, req) {
	let result = json.result
	let query = req.query

	result.total = result.data.length	// 写死了
	// 由于query是空的，所以一直是10 ↓
	// result.data = result.data.splice(query.offset, query.limit || 10)
	result.data = result.data.splice(10, query.limit || 10)

	result.query = query
	return json
}