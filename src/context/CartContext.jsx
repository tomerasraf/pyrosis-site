import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'pyrosis_cart'
const savedItems = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'SET_QTY':
      return {
        ...state,
        items: action.qty <= 0
          ? state.items.filter(i => i.id !== action.id)
          : state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_OPEN':
      return { ...state, open: !state.open }
    case 'CLOSE':
      return { ...state, open: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: savedItems(), open: false })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const totalQty   = state.items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = state.items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{ ...state, totalQty, totalPrice, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
