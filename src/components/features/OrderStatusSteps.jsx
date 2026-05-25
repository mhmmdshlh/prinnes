export default function OrderStatusSteps({ status, className = '' }) {
  const statusSteps = ['menunggu', 'diproses', 'selesai', 'siap_diambil']
  const statusStepLabels = ['Menunggu', 'Diproses', 'Selesai', 'Siap Diambil']

  const currentStep = statusSteps.indexOf(status)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {statusStepLabels.map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentStep ? 'bg-primary text-white' : 'bg-outline/30 text-muted'
              }`}
            >
              {i + 1}
            </div>
            <p
              className={`mt-1 text-xs ${
                i <= currentStep ? 'text-primary font-medium' : 'text-muted'
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-outline/30 relative mt-2 h-2 rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}