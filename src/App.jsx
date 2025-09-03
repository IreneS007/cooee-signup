import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from 'react'
import './index.css'
import bg1 from "./assets/bg1.jpg";

const mockApi = {
  fetchCountries: () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { code: 'US', name: 'USA' },
            { code: 'CA', name: 'Canada' },
            { code: 'AU', name: 'Australia' },
            { code: 'NL', name: 'Netherlands' },
            { code: 'IN', name: 'India' },
          ]),
        300
      )
    ),
  fetchNumbersByCountry: (code) =>
    new Promise((resolve) =>
      setTimeout(() => {
        // Define unique patterns per country
        const formats = {
          US: () => `+1 (${Math.floor(200 + Math.random() * 800)}) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
          CA: () => `+1 (${Math.floor(200 + Math.random() * 800)}) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
          AU: () => `+61 ${Math.floor(400 + Math.random() * 500)} ${100 + Math.floor(Math.random() * 900)} ${100 + Math.floor(Math.random() * 900)}`,
          NL: () => `+31 ${Math.floor(10 + Math.random() * 90)} ${100 + Math.floor(Math.random() * 900)} ${1000 + Math.floor(Math.random() * 9000)}`,
          IN: () => `+91 ${70000 + Math.floor(Math.random() * 99999)}${1000 + Math.floor(Math.random() * 9000)}`
        };

        // Use pattern or fallback
        const generator = formats[code] || (() => `+${code} 555-${1000 + Math.floor(Math.random() * 9000)}`);

        // Generate 8 numbers
        const randomNumbers = Array.from({ length: 8 }, () => generator());

        resolve(randomNumbers);
      }, 400)
    ),
  fetchPlans: () =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            { id: 'basic', name: 'Basic', price: 5, features: ['100 mins', 'SMS included'] },
            { id: 'pro', name: 'Pro', price: 12, features: ['500 mins', 'SMS + MMS'] },
            { id: 'premium', name: 'Premium', price: 25, features: ['Unlimited', 'Priority support'] },
          ]),
        200
      )
    ),
  register: () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, userId: 'usr_' + Date.now() }), 600)),
  pay: (amount) => new Promise((resolve) => setTimeout(() => resolve({ ok: true, txnId: 'txn_' + Date.now(), amount }), 900)),
}

function validateEmail(email) {
  return /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(
    email
  )
}

function maskCard(num) {
  const last4 = num.slice(-4).padStart(4, '•')
  return `•••• ${last4}`
}

function StepHeader({ step, total, title }) {
  // Remove step info, only show title, and remove cursor
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-center gap-2 text-lg font-semibold select-none cursor-default">
        {title}
      </div>
    </div>
  )
}

function CountryNumberStep({ selection, onSelect }) {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(selection?.country || '')
  const [numbers, setNumbers] = useState([])
  const [loading, setLoading] = useState(false)
  const [countryTouched, setCountryTouched] = useState(false)

  useEffect(() => {
    mockApi.fetchCountries().then(setCountries)
  }, [])

  useEffect(() => {
    if (!country) return
    setLoading(true)
    setNumbers([])
    mockApi.fetchNumbersByCountry(country).then((nums) => {
      setNumbers(nums)
      setLoading(false)
    })
  }, [country])
return (
  <div className="w-full max-w-4xl mx-auto rounded-xl">
    {/* Step card */}
    <div
      className={`
        rounded-xl border p-6 space-y-6
        bg-white text-black
        dark:bg-[#18181b] dark:text-white
      `}
    >
      <div>
        <label
          className="block text-sm font-medium mb-1 select-none cursor-default 
                     text-gray-700 dark:text-gray-300"
        >
          Country
        </label>
        <select
          className="w-full border border-black dark:border-gray-500 rounded-md p-2 
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onBlur={() => setCountryTouched(true)}
          required
          aria-invalid={countryTouched && !country}
        >
          <option value="">Select a country...</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {countryTouched && !country && (
          <p className="mt-1 text-xs text-red-600">Country is required.</p>
        )}
      </div>

      {country && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold select-none cursor-default">
                Numbers available
              </span>
            </div>
            {loading && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Checking availability…
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => onSelect({ country, number: num })}
                className={`
                  border rounded-md p-3 text-left transition-all
                  bg-white dark:bg-[#27272a]
                  text-black dark:text-white
                  ${
                    selection?.number === num
                      ? 'border-black dark:border-white ring-2 ring-black/10 dark:ring-white/20'
                      : 'hover:border-black dark:hover:border-white'
                  }
                `}
              >
                <div className="font-semibold">{num}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Tap to choose
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
)
}

function PlanStep({ selectedPlan, onSelect }) {
  const [plans, setPlans] = useState([])
  useEffect(() => {
    mockApi.fetchPlans().then(setPlans)
  }, [])
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* <StepHeader step={2} total={5} title="Choose a subscription plan" /> */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className={` rounded-xl border p-6 transition-all ${selectedPlan?.id === p.id ? 'border-black' : 'border-gray-200 hover:border-black'}`}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold uppercase tracking-wide select-none cursor-default">{p.name}</h3>
              <span className="inline-flex items-center rounded-full border text-xs font-semibold px-2.5 py-1 
                bg-black text-white dark:bg-white dark:text-black">${p.price}/mo</span>
            </div>
            <ul className="mt-3 text-sm text-gray-600 space-y-1 list-disc list-inside">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button onClick={() => onSelect(p)} className="mt-4 w-full bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900">Select</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegistrationStep({ defaultValues, onSubmit }) {
  const [form, setForm] = useState({
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    password: '',
    confirm: '',
    address: defaultValues?.address || '',
    consent: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({})

  const strongPw = form.password.length >= 8
  const emailOk = validateEmail(form.email)
  const matches = form.password === form.confirm

  const canSubmit = useMemo(() => {
    return form.name && emailOk && strongPw && matches && form.consent
  }, [form, emailOk, strongPw, matches])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    const res = await mockApi.register(form)
    setLoading(false)
    if (res.ok) onSubmit({ ...form, userId: res.userId })
    else setError('Registration failed. Please try again.')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* <StepHeader step={3} total={5} title="Create your account" /> */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 p-6 space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 cursor-default">Full name</label>
          <input
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onBlur={() => setTouched({ ...touched, name: true })}
            required
            aria-invalid={touched.name && !form.name}
          />
          {touched.name && !form.name && (
            <p className="mt-1 text-xs text-red-600">Full name is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Email</label>
          <input
            type="email"
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            required
            aria-invalid={touched.email && !validateEmail(form.email)}
          />
          {touched.email && !form.email && (
            <p className="mt-1 text-xs text-red-600">Email is required.</p>
          )}
          {form.email && !validateEmail(form.email) && (
            <p className="mt-1 text-xs text-red-600">Enter a valid email.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Password</label>
          <input
            type="password"
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onBlur={() => setTouched({ ...touched, password: true })}
            placeholder="At least 8 characters"
            required
            aria-invalid={touched.password && !strongPw}
          />
          {touched.password && !form.password && (
            <p className="mt-1 text-xs text-red-600">Password is required.</p>
          )}
          {form.password && form.password.length < 8 && (
            <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Confirm password</label>
          <input
            type="password"
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            onBlur={() => setTouched({ ...touched, confirm: true })}
            required
            aria-invalid={touched.confirm && (!form.confirm || !matches)}
          />
          {touched.confirm && !form.confirm && (
            <p className="mt-1 text-xs text-red-600">Please confirm your password.</p>
          )}
          {form.confirm && form.confirm !== form.password && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Address (optional)</label>
          <textarea
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            onBlur={() => setTouched({ ...touched, address: true })}
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-gray-700 select-none cursor-default">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            onBlur={() => setTouched({ ...touched, consent: true })}
            required
            aria-invalid={touched.consent && !form.consent}
          />
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
        {touched.consent && !form.consent && (
          <p className="mt-1 text-xs text-red-600">You must agree before continuing.</p>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={!canSubmit || loading} className="w-full bg-black text-white rounded-md px-4 py-2 disabled:opacity-60 hover:bg-gray-900">
          {loading ? 'Creating account…' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

function PaymentStep({ amount, onPaid }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '' })
  const [touched, setTouched] = useState({})

  const valid = useMemo(() => {
    const numOk = /^\d{16}$/.test(card.number.replace(/\s/g, ''))
    const expOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.exp)
    const cvcOk = /^\d{3,4}$/.test(card.cvc)
    const nameOk = card.name.trim().length > 1
    return numOk && expOk && cvcOk && nameOk
  }, [card])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setError('')
    const res = await mockApi.pay(amount)
    setLoading(false)
    if (res.ok) onPaid({ ...res, last4: card.number.slice(-4) })
    else setError('Payment failed. Please retry.')
  }
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* <StepHeader step={4} total={5} title="Payment" /> */}
      <form onSubmit={handlePay} className="rounded-xl border border-gray-200 p-6 space-y-4" noValidate>
        <div className="flex items-center justify-between">
          <span className="text-gray-800 uppercase tracking-wide text-xs select-none cursor-default">Amount due</span>
          <span className="text-xl font-bold text-black select-none cursor-default">${amount.toFixed(2)}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Name on card</label>
          <input
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            onBlur={() => setTouched({ ...touched, name: true })}
            required
            aria-invalid={touched.name && !card.name.trim()}
          />
          {touched.name && !card.name.trim() && (
            <p className="mt-1 text-xs text-red-600">Name on card is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Card number</label>
          <input
            inputMode="numeric"
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim() })}
            onBlur={() => setTouched({ ...touched, number: true })}
            required
            aria-invalid={touched.number && !/^\d{16}$/.test(card.number.replace(/\s/g, ''))}
          />
          {touched.number && !card.number.replace(/\s/g, '') && (
            <p className="mt-1 text-xs text-red-600">Card number is required.</p>
          )}
          {card.number && !/^\d{16}$/.test(card.number.replace(/\s/g, '')) && (
            <p className="mt-1 text-xs text-red-600">Enter a valid 16-digit card number.</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">Expiry (MM/YY)</label>
            <input
              placeholder="MM/YY"
              className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={card.exp}
              onChange={(e) => setCard({ ...card, exp: e.target.value })}
              onBlur={() => setTouched({ ...touched, exp: true })}
              required
              aria-invalid={touched.exp && !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.exp)}
            />
            {touched.exp && !card.exp && (
              <p className="mt-1 text-xs text-red-600">Expiry is required.</p>
            )}
            {card.exp && !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.exp) && (
              <p className="mt-1 text-xs text-red-600">Enter expiry as MM/YY.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1 select-none cursor-default">CVC</label>
            <input
              inputMode="numeric"
              maxLength={4}
              className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/[^\d]/g, '') })}
              onBlur={() => setTouched({ ...touched, cvc: true })}
              required
              aria-invalid={touched.cvc && !/^\d{3,4}$/.test(card.cvc)}
            />
            {touched.cvc && !card.cvc && (
              <p className="mt-1 text-xs text-red-600">CVC is required.</p>
            )}
            {card.cvc && !/^\d{3,4}$/.test(card.cvc) && (
              <p className="mt-1 text-xs text-red-600">Enter a valid 3 or 4 digit CVC.</p>
            )}
          </div>
        </div>
        {!valid && (
          <p className="text-xs text-gray-500">Enter a valid name, 16-digit card, expiry and CVC.</p>
        )}
        <button type="submit" disabled={!valid || loading} className="w-full bg-black text-white rounded-md px-4 py-2 hover:bg-gray-900 disabled:opacity-60">
          {loading ? 'Processing…' : `Pay ${maskCard(card.number.replace(/\s/g, ''))}`}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  )
}

function Confirmation({ number, plan, txn }) {
  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <StepHeader step={5} total={5} title="Confirmation" />
      <div className="rounded-xl border border-gray-200 p-8 space-y-4">
        <div className="text-2xl font-bold text-black dark:text-white select-none cursor-default">Activated</div>
        <div className="text-xs uppercase tracking-wide text-gray-500 select-none cursor-default">Your number</div>
        <div className="text-3xl font-extrabold select-none cursor-default">{number}</div>
        <div className="text-gray-700 select-none cursor-default">Plan: {plan.name} (${plan.price}/mo)</div>
        <div className="text-gray-500 text-xs select-none cursor-default">Txn: {txn.txnId}</div>
      </div>
    </div>
  )
}  

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center:       { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};    

export default function App() {
  const [step, setStep] = useState(1)
  const [selection, setSelection] = useState(null)
  const [plan, setPlan] = useState(null)
  const [user, setUser] = useState(null)
  const [payment, setPayment] = useState(null)
  const [darkMode, setDarkMode] = useState(false) // dark mode state

  
  const [direction, setDirection] = useState(1);

// Helper to move between steps with direction
 const goTo = (nextStep) => {
  setDirection(nextStep > step ? 1 : -1);
  setStep(nextStep);
};
 
  const resetFlow = () => {
    setStep(1)
    setSelection(null)
    setPlan(null)
    setUser(null)
    setPayment(null)
  }

  return (
    <div className={`${darkMode ? 'bg-[#23272f] text-white' : 'light-mode-area text-black'} min-h-screen`}>
      <header className={`border-b ${darkMode ? 'border-[#0ff4] bg-[#23272f]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <button
            className="text-2xl font-extrabold tracking-tight cursor-pointer bg-transparent border-none p-0 m-0"
            onClick={e => { resetFlow(); e.currentTarget.blur(); }}
            title="Go Home"
            style={{ userSelect: 'none' }}
            type="button"
          >
            COOEE
          </button>
          <div className="flex items-center gap-3">
            
            {/* Toggle switch for dark mode */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(d => !d)}
                className="sr-only"
                aria-label="Toggle dark mode"
              />
              <span className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-[#0ff4]' : ''}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : ''}`}></span>
              </span>
              <span className="ml-2 text-xs uppercase tracking-wide">{darkMode ? 'Dark' : 'Light'}</span>
            </label>
          </div>
        </div>
      </header>

      <div className={`main-content-area max-w-5xl mx-auto px-4 py-8 space-y-6 ${darkMode ? 'dark-mode-area' : 'light-mode-area'}`}>
        {/* Add this block here */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-full">
            <img
              src={bg1}
              alt="Welcome"
              className="w-full rounded-xl shadow-lg mb-0 object-cover"
              style={{
                maxWidth: '100%',
                height: 'clamp(220px,40vw,420px)', // responsive height
                minHeight: '220px',
              }}
            />
            <div
              className="absolute bottom-6 right-8 px-6 py-4   shadow-lg welcome-box "
              style={{
               
                fontFamily: "'Quicksand', Arial, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1.2rem,2vw,2rem)',
                color: '#23272f',
                textAlign: 'right',
                maxWidth: '70vw',
              }}
            >
              Let’s get you connected <br />
              Choose your number & get started.
            </div>
          </div>
        </div>
        {/* Step bar starts below */}
       <div
  className={`${
    darkMode ? 'bg-[#23272f] border-[#0ff4]' : '!bg-white border-gray-200'
  } rounded-xl border p-3`}
>
  {/* Use flex justify-center on desktop, overflow-x-auto on mobile */}
  <div className="flex items-center w-full overflow-x-auto sm:justify-between">
    {['Number','Plan','Register','Payment','Done'].map((label, idx) => {
      const isActive = step === idx + 1
      const isDone = step > idx + 1
      return (
        <div key={label} className="flex items-center flex-shrink-0 sm:flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold border ${
                isDone
                  ? darkMode
                    ? 'bg-[#0ff4] text-[#23272f] border-[#0ff4]'
                    : 'bg-black text-white border-black'
                  : isActive
                  ? darkMode
                    ? 'bg-[#23272f] text-[#0ff4] border-[#0ff4]'
                    : 'bg-white text-black border-black'
                  : darkMode
                  ? 'bg-[#23272f] text-[#80deea] border-[#0ff4]'
                  : 'bg-white text-gray-400 border-gray-300'
              }`}
            >
              {isDone ? '✓' : idx + 1}
            </span>
            <span
              className={`uppercase tracking-wide text-[11px] ${
                isActive
                  ? darkMode
                    ? 'text-[#0ff4]'
                    : 'text-black'
                  : darkMode
                  ? 'text-[#80deea]'
                  : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
          {idx < 4 && (
            <div
              className={`flex-1 h-px ${
                darkMode ? 'bg-[#0ff4]' : 'bg-gray-300'
              } mx-3`}
            />
          )}
        </div>
      )
    })}
  </div>
</div>

        
        
       
        {/* Animated step content (Framer Motion) */}
 
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={step}                // key must change per step
    custom={direction}        // pass direction to variants
    variants={stepVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.28, ease: "easeOut" }}
  >
    {step === 1 && (
      <CountryNumberStep
        selection={selection}
        onSelect={(sel) => {
          setSelection(sel);
          goTo(2);            
        }}
      />
    )}

    {step === 2 && (
      <PlanStep
        selectedPlan={plan}
        onSelect={(p) => {
          setPlan(p);
          goTo(3);
        }}
      />
    )}

    {step === 3 && (
      <RegistrationStep
        defaultValues={user}
        onSubmit={(u) => {
          setUser(u);
          goTo(4);
        }}
      />
    )}

    {step === 4 && plan && (
      <PaymentStep
        amount={plan.price}
        onPaid={(txn) => {
          setPayment(txn);
          goTo(5);
        }}
      />
    )}

    {step === 5 && selection && plan && payment && (
      <Confirmation number={selection.number} plan={plan} txn={payment} />
    )}
  </motion.div>
</AnimatePresence>

<div className="pt-4 flex items-center gap-4">
  {step > 1 && step < 5 && (
    <button
      className={`text-sm underline underline-offset-4 decoration-dotted ${darkMode ? 'text-[#0ff4] hover:text-white' : 'text-gray-800 hover:text-black'}`}
      onClick={() => goTo(step - 1)}   
    >
      ← Back
    </button>
  )}

  {step === 5 && (
    <button
      className={`text-sm ${darkMode ? 'text-[#0ff4] hover:text-white' : 'text-gray-700 hover:text-black'}`}
      onClick={() => { resetFlow(); setDirection(1); }} 
    >
      Start over
    </button>
  )}
</div>

      </div>
    </div>
  )
}


