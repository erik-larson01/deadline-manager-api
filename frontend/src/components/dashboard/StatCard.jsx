function StatCard({ label, value, valueColor, icon: Icon, subLabel = null }) {
	return (
		<article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="flex items-center gap-2 text-sm font-medium text-gray-600">
				{Icon ? <Icon size={16} className="text-gray-500" /> : null}
				<span>{label}</span>
			</div>

			<p className={`mt-4 text-3xl font-semibold ${valueColor}`}>{value}</p>

			{subLabel ? <p className="mt-1 text-xs text-gray-500">{subLabel}</p> : null}
		</article>
	)
}

export default StatCard
