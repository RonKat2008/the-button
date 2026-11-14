interface BigButtonProps {
  label: string
  isBusy: boolean
  disabled?: boolean
  onPress: () => void
}

export function BigButton({ label, isBusy, disabled, onPress }: BigButtonProps) {
  return (
    <button
      type="button"
      className="big-button"
      data-busy={isBusy || undefined}
      disabled={disabled || isBusy}
      aria-busy={isBusy}
      onClick={onPress}
    >
      <span className="big-button-base" aria-hidden="true" />
      <span className="big-button-cap">
        <span className="big-button-label">{label}</span>
      </span>
    </button>
  )
}
