type Props = {
  name: string
  type: string
  placeholder: string
}

const CustomizedInput = ({ name, type, placeholder }: Props) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent focus:bg-white transition-all duration-200 text-sm font-medium"
    />
  )
}

export default CustomizedInput