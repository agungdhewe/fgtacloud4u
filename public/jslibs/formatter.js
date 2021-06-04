function currencyRupiah(value) {
	let uang = parseInt(value) ?? 0
	let format = new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 3 }).format(uang)

	return `Rp. ${format}`
}