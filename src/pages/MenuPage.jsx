import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData, categories } from '../data/menuData'
import { useCart } from '../context/CartContext'
import { menuImages } from '../assets/images/menuImages'
import bannerPaneerFriedRice from '../assets/images/banners/New_Banner_Paneer_fired_Rice.png'
import bannerKurkureMomos    from '../assets/images/banners/New_Banner_Kurkure_Momos.png'
import bannerSchezwanNoodles from '../assets/images/banners/New_Banner_Schezwan_noodles.png'

const C = {
  cream:  '#F7F5F0',
  blue:   '#1F4591',
  yellow: '#F2CF4A',
  sage:   '#A8D5A2',
  green:  '#7FB36B',
  orange: '#E85D3F',
  card:   '#FFFFFF',
}

/* ─── SVG components ─────────────────────────────────────────────────────────── */
const SmallLeaf = ({ flip = false }) => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M11 26 C11 18 4 12 2 5 C7 2 13 8 11 14" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M11 14 L11 26" stroke={C.blue} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11 20 C14 18 18 15 20 10" stroke={C.blue} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
)

const Dots = ({ n = 5, opacity = 0.4 }) => (
  <svg width={n*14} height="14" viewBox={`0 0 ${n*14} 14`} fill="none">
    {Array.from({length:n}).map((_,i)=>(
      <circle key={i} cx={i*14+7} cy="7" r={i%2===0?3:2} fill={C.blue} opacity={opacity+(i%3)*0.1}/>
    ))}
  </svg>
)

/* ─── Food illustrations ─────────────────────────────────────────────────────── */
const FoodImg = ({ type = 'noodles', size = 80 }) => {
  const imgs = {
    noodles: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="56" rx="30" ry="10" fill="#E8956D" opacity="0.3"/>
        <path d="M10 42 C10 42 14 68 40 68 C66 68 70 42 70 42Z" fill="#D4742A"/>
        <ellipse cx="40" cy="42" rx="30" ry="10" fill="#E8956D"/>
        <path d="M15 40 C20 36 25 40 30 37 C35 34 40 38 45 35 C50 32 55 36 60 33" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="28" cy="38" r="5" fill="#C0392B"/>
        <circle cx="52" cy="36" r="4" fill="#27AE60"/>
        <circle cx="40" cy="34" r="3.5" fill="#F39C12"/>
      </svg>
    ),
    rice: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="58" rx="28" ry="9" fill="#B8860B" opacity="0.3"/>
        <path d="M12 44 C12 44 16 66 40 66 C64 66 68 44 68 44Z" fill="#DAA520"/>
        <ellipse cx="40" cy="44" rx="28" ry="9" fill="#F0C040"/>
        {Array.from({length:18}).map((_,i)=>(
          <ellipse key={i} cx={20+Math.sin(i*1.8)*16} cy={38+Math.cos(i*2.2)*5} rx="2" ry="1.2" fill="#fff" opacity="0.7" transform={`rotate(${i*20} ${20+Math.sin(i*1.8)*16} ${38+Math.cos(i*2.2)*5})`}/>
        ))}
        <circle cx="30" cy="40" r="5" fill="#E74C3C"/>
        <circle cx="50" cy="38" r="4" fill="#2ECC71"/>
      </svg>
    ),
    momo: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="60" rx="26" ry="8" fill="#BDC3C7" opacity="0.4"/>
        {[[24,40],[34,34],[44,33],[54,40],[28,50],[40,52],[52,49]].map(([cx,cy],i)=>(
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="9" ry="7" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="1"/>
            <path d={`M${cx-4} ${cy} Q${cx} ${cy-4} ${cx+4} ${cy}`} stroke="#BDC3C7" strokeWidth="0.8" fill="none"/>
          </g>
        ))}
        <circle cx="40" cy="68" r="3" fill="#E74C3C" opacity="0.8"/>
      </svg>
    ),
    side: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <rect x="15" y="35" width="50" height="30" rx="8" fill="#F39C12"/>
        <rect x="15" y="32" width="50" height="12" rx="6" fill="#E67E22"/>
        <circle cx="30" cy="50" r="4" fill="#E74C3C"/>
        <circle cx="42" cy="52" r="3.5" fill="#27AE60"/>
        <circle cx="54" cy="49" r="4" fill="#F1C40F"/>
        <rect x="36" y="18" width="8" height="18" rx="2" fill="#8B4513"/>
        <rect x="44" y="20" width="7" height="16" rx="2" fill="#8B4513"/>
      </svg>
    ),
  }
  return imgs[type] || imgs.noodles
}

/* ─── Category icons ─────────────────────────────────────────────────────────── */
const NoodleIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <path d="M4 14 C6 10 10 12 12 10 C14 8 16 10 18 8 C20 6 22 9 24 8" stroke={active?'#fff':C.blue} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M4 18 C7 14 11 16 14 14 C17 12 20 14 24 12" stroke={active?'#fff':C.blue} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 22 C8 20 12 21 16 20 C20 19 22 21 24 20" stroke={active?'#fff':C.blue} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)
const RiceIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <path d="M5 18 C5 18 7 26 14 26 C21 26 23 18 23 18Z" stroke={active?'#fff':C.blue} strokeWidth="1.8" fill="none"/>
    <ellipse cx="14" cy="18" rx="9" ry="4" stroke={active?'#fff':C.blue} strokeWidth="1.8" fill="none"/>
    {[10,14,18].map((cx,i)=><circle key={i} cx={cx} cy="15" r="1.2" fill={active?'#fff':C.blue}/>)}
  </svg>
)
const MomoIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    {[[8,14],[14,10],[20,14],[11,20],[17,20]].map(([cx,cy],i)=>(
      <ellipse key={i} cx={cx} cy={cy} rx="4.5" ry="3.5" stroke={active?'#fff':C.blue} strokeWidth="1.5" fill="none"/>
    ))}
  </svg>
)
const SideIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <rect x="5" y="13" width="18" height="12" rx="3" stroke={active?'#fff':C.blue} strokeWidth="1.8" fill="none"/>
    <rect x="5" y="11" width="18" height="5" rx="2.5" stroke={active?'#fff':C.blue} strokeWidth="1.8" fill="none"/>
    <path d="M10 8 L10 11M14 7 L14 11M18 8 L18 11" stroke={active?'#fff':C.blue} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const categoryIcons = { noodles: NoodleIcon, rice: RiceIcon, momos: MomoIcon, sides: SideIcon }

/* ─── Banner data ────────────────────────────────────────────────────────────── */
const BANNERS = [
  { badge: 'MOST LOVED',          name: 'Paneer\nFried Rice',  price: '₹179', img: bannerPaneerFriedRice, tagColor: C.green,  blobColor: C.sage,    nameColor: C.blue    },
  { badge: 'CRISPY SPECIAL',      name: 'Kurkure\nMomos',      price: '₹169', img: bannerKurkureMomos,    tagColor: C.orange, blobColor: '#FFCCC0', nameColor: C.orange  },
  { badge: "TODAY'S BEST SELLER", name: 'Schezwan\nNoodles',   price: '₹169', img: bannerSchezwanNoodles, tagColor: C.blue,   blobColor: C.yellow,  nameColor: '#3a8a35' },
]

/* ─── Food Card ──────────────────────────────────────────────────────────────── */
function FoodCard({ item }) {
  const { addItem, removeItem, getQty } = useCart()
  const qty = getQty(item)
  const isNonVeg = item.tag === 'NON-VEG'

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(31,69,145,0.16)' }}
      style={{
        minWidth: 140, maxWidth: 140,
        background: C.card, borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(31,69,145,0.09)',
        flexShrink: 0,
      }}
    >
      <div style={{ background: 'linear-gradient(135deg,#FFF8F0,#FFF0E8)', height: 100, position: 'relative', overflow: 'hidden' }}>
        {menuImages[item.imgKey]
          ? <img src={menuImages[item.imgKey]} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FoodImg type={item.type} size={75}/></div>
        }
        <div style={{ position: 'absolute', top: 6, right: 6, background: C.yellow, borderRadius: 8, padding: '2px 7px', fontSize: 9, fontWeight: 700, color: C.blue, fontFamily: "'Poppins',sans-serif", letterSpacing: '0.05em' }}>
          {item.tag || 'POPULAR'}
        </div>
      </div>
      <div style={{ padding: '8px 12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.blue, fontFamily: "'Poppins',sans-serif", lineHeight: 1.3, flex: 1, paddingRight: 4, minHeight: 28 }}>
            {item.name}
          </div>
          <div style={{ width: 10, height: 10, borderRadius: 2, border: `1.5px solid ${isNonVeg ? '#C0392B' : '#27AE60'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: isNonVeg ? '#C0392B' : '#27AE60' }}/>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.green, fontFamily: "'Poppins',sans-serif" }}>₹{item.price}</span>
          {qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => addItem(item)}
              style={{
                background: C.blue, border: 'none', cursor: 'pointer',
                borderRadius: 10, padding: '4px 10px',
                fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: 'white',
              }}
            >+ ADD</motion.button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', background: C.blue, borderRadius: 10, overflow: 'hidden' }}>
              <motion.button whileTap={{ scale: 0.82 }} onClick={() => removeItem(item)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 16, fontWeight: 700, lineHeight: 1, padding: '3px 7px' }}>−</motion.button>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: 'white', minWidth: 16, textAlign: 'center' }}>{qty}</span>
              <motion.button whileTap={{ scale: 0.82 }} onClick={() => addItem(item)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 16, fontWeight: 700, lineHeight: 1, padding: '3px 7px' }}>+</motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Menu Section ───────────────────────────────────────────────────────────── */
function MenuSection({ data, sectionRef }) {
  return (
    <div ref={sectionRef} style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, paddingLeft: 20, paddingRight: 20 }}>
        <span style={{ fontFamily: "'Bungee',cursive", fontSize: 18, color: C.blue, letterSpacing: '0.04em' }}>{data.title}</span>
        <div style={{ width: 28, height: 2.5, background: C.yellow, borderRadius: 2, marginLeft: 10 }}/>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 6, scrollbarWidth: 'none' }}>
        {data.items.map((item, i) => <FoodCard key={i} item={item}/>)}
      </div>
    </div>
  )
}

/* ─── MENU PAGE ──────────────────────────────────────────────────────────────── */
export default function MenuPage() {
  const navigate = useNavigate()
  const { totalItems, totalPrice } = useCart()
  const [activeCat, setActiveCat] = useState('noodles')
  const [currentBanner, setCurrentBanner] = useState(0)

  const noodlesRef = useRef(null)
  const riceRef    = useRef(null)
  const momosRef   = useRef(null)
  const sidesRef   = useRef(null)
  const sectionRefs = { noodles: noodlesRef, rice: riceRef, momos: momosRef, sides: sidesRef }

  // Auto-advance banner every 3 s
  useEffect(() => {
    const t = setInterval(() => setCurrentBanner(p => (p + 1) % BANNERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Update active category chip as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.dataset.cat) {
            setActiveCat(entry.target.dataset.cat)
          }
        })
      },
      { rootMargin: '-130px 0px -50% 0px', threshold: 0 }
    )
    categories.forEach(({ id }) => {
      const el = sectionRefs[id]?.current
      if (el) { el.dataset.cat = id; observer.observe(el) }
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    setActiveCat(id)
    const el = sectionRefs[id]?.current
    if (!el) return
    const STICKY_H = 130
    const top = el.getBoundingClientRect().top + window.pageYOffset - STICKY_H
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const banner = BANNERS[currentBanner]

  return (
    <div style={{ minHeight: '100vh', background: C.cream, position: 'relative' }}>

      {/* fixed background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          style={{ position: 'absolute', top: 200, left: -60, width: 180, height: 210, opacity: 0.4 }}
          animate={{ y: [0,-12,0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 180 210" fill="none" style={{ width:'100%', height:'100%' }}>
            <path d="M90 10 C130 5 165 35 172 75 C179 115 160 165 130 185 C100 205 55 200 28 175 C1 150 -5 105 8 70 C21 35 50 15 90 10Z" fill={C.sage}/>
          </svg>
        </motion.div>
        <motion.div
          style={{ position: 'absolute', top: -20, right: -30, width: 160, height: 160, opacity: 0.6 }}
          animate={{ y: [0,-8,0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <svg viewBox="0 0 160 160" fill="none" style={{ width:'100%', height:'100%' }}>
            <path d="M80 8 C115 2 148 28 155 62 C162 96 145 138 118 152 C91 166 50 158 28 135 C6 112 2 72 16 45 C30 18 45 14 80 8Z" fill={C.yellow}/>
          </svg>
        </motion.div>
      </div>

      {/* ── Sticky header + category tabs ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(247,245,240,0.96)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(31,69,145,0.07)',
      }}>
        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px 10px' }}>
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/')}
            style={{
              width: 38, height: 38, borderRadius: 19,
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(31,69,145,0.13)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <SmallLeaf/>
              <div>
                <div style={{ fontFamily: "'Bungee',cursive", fontSize: 18, color: C.blue, letterSpacing: '0.06em', lineHeight: 1 }}>ANNAPURNA</div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 600, color: C.blue, opacity: 0.55, letterSpacing: '0.3em' }}>MENU</div>
              </div>
              <SmallLeaf flip/>
            </div>
          </div>

          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={() => totalItems > 0 && navigate('/cart')}
            style={{
              width: 38, height: 38, borderRadius: 19,
              background: totalItems > 0 ? C.yellow : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(31,69,145,0.13)',
              cursor: totalItems > 0 ? 'pointer' : 'default',
              flexShrink: 0, position: 'relative',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke={C.blue} strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke={C.blue} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {totalItems > 0 && (
              <div style={{ position: 'absolute', top: -3, right: -3, width: 17, height: 17, borderRadius: '50%', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 700, color: 'white' }}>{totalItems}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 12px', scrollbarWidth: 'none' }}>
          {categories.map(({ id, label }) => {
            const isActive = activeCat === id
            const Icon = categoryIcons[id]
            return (
              <motion.div
                key={id}
                whileTap={{ scale: 0.93 }}
                onClick={() => scrollToSection(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 50, flexShrink: 0,
                  background: isActive ? C.green : 'white',
                  boxShadow: isActive ? '0 3px 12px rgba(127,179,107,0.4)' : '0 1px 8px rgba(31,69,145,0.08)',
                  border: isActive ? 'none' : '1.5px solid rgba(31,69,145,0.1)',
                  cursor: 'pointer', transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                <Icon active={isActive}/>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 600, color: isActive ? 'white' : C.blue, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 16, paddingBottom: 90 }}>

        {/* HERO BANNER CAROUSEL */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', height: 160, boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.38, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
              >
                {/* banner photo */}
                <img
                  src={banner.img}
                  alt={banner.name}
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
                {/* left gradient overlay for text readability */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(255,255,255,0.82) 0%,rgba(255,255,255,0.40) 42%,rgba(255,255,255,0) 65%)' }}/>

                {/* blob accent */}
                <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, background: banner.blobColor, borderRadius: '60% 40% 55% 45%', opacity: 0.25 }}/>
                <div style={{ position: 'absolute', top: 12, right: 90, opacity: 0.35 }}><Dots n={3} opacity={0.3}/></div>

                {/* text */}
                <div style={{ position: 'relative', zIndex: 2, padding: '18px 16px 18px 22px', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ background: banner.tagColor, borderRadius: 8, padding: '3px 10px', display: 'inline-block', marginBottom: 7 }}>
                      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 700, color: 'white', letterSpacing: '0.08em' }}>{banner.badge}</span>
                    </div>
                    <div style={{ fontFamily: "'Caveat',cursive", fontSize: 22, fontWeight: 700, color: banner.nameColor, lineHeight: 1.1, marginBottom: 8, whiteSpace: 'pre-line' }}>
                      {banner.name}
                    </div>
                    <div style={{ fontFamily: "'Bungee',sans-serif", fontSize: 20, color: C.blue }}>{banner.price}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 10 }}>
            {BANNERS.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => setCurrentBanner(i)}
                animate={{ width: currentBanner === i ? 22 : 8, background: currentBanner === i ? C.blue : C.sage }}
                transition={{ duration: 0.3 }}
                style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* ALL MENU SECTIONS */}
        {categories.map(({ id }) => (
          <MenuSection key={id} data={menuData[id]} sectionRef={sectionRefs[id]}/>
        ))}

      </div>

      {/* ── Floating View Cart bar (shows when cart has items) ── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 25,
              background: 'rgba(247,245,240,0.97)', backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(31,69,145,0.08)',
              padding: '12px 20px 16px',
            }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/cart')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: C.blue, border: 'none', cursor: 'pointer',
                borderRadius: 50, padding: '12px 20px',
                boxShadow: '0 8px 24px rgba(31,69,145,0.28)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: C.yellow, borderRadius: 50, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, color: C.blue }}>{totalItems}</span>
                </div>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.04em' }}>
                  {totalItems === 1 ? '1 item' : `${totalItems} items`}
                </span>
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: 'white', letterSpacing: '0.06em' }}>
                VIEW CART
              </span>
              <span style={{ fontFamily: "'Bungee',sans-serif", fontSize: 14, color: 'white' }}>
                ₹{totalPrice}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
