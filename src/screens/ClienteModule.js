import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../theme";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ClienteModule({ navigation, route }) {
  const [user] = useState(route.params?.user || null);
  const [activeTab, setActiveTab] = useState("menu");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [cartItems, setCartItems] = useState([]);
  const [pagoMethod, setPagoMethod] = useState("Efectivo");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [contacto, setContacto] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [savingOrden, setSavingOrden] = useState(false);
  const [propina, setPropina] = useState(0);
  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);
  const [userName, setUserName] = useState(
    user?.displayName || user?.email?.split("@")[0] || "Cliente",
  );

  const categories = ["Todos", "Cocina", "Bar", "Bebidas", "Postres"];

  const menuData = {
    "PLATOS PRINCIPALES": [
      {
        id: "1",
        nombre: "Patacón pisao",
        descripcion: "Con hogao, chicharrón y ají",
        emoji: "🍌",
        precio: 14000,
        categoria: "Cocina",
      },
      {
        id: "2",
        nombre: "Chuleta de cerdo",
        descripcion: "Con arroz, ensalada y maduro",
        emoji: "🥩",
        precio: 32000,
        categoria: "Cocina",
      },
      {
        id: "3",
        nombre: "Sancocho de pescado",
        descripcion: "Receta tradicional del Pacífico",
        emoji: "🐟",
        precio: 28000,
        categoria: "Cocina",
      },
    ],
    BEBIDAS: [
      {
        id: "4",
        nombre: "Michelada",
        descripcion: "Con limón, sal y salsa negra",
        emoji: "🍺",
        precio: 15000,
        categoria: "Bar",
      },
      {
        id: "5",
        nombre: "Lulada caleña",
        descripcion: "Lulo natural con agua de panela",
        emoji: "🥤",
        precio: 12000,
        categoria: "Bebidas",
      },
    ],
  };

  // Carga nombre del usuario desde Firestore
  useEffect(() => {
    if (!user?.uid || !db) return;
    getDoc(doc(db, "usuarios", user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const nombre = snap.data().nombre || snap.data().displayName;
          if (nombre) setUserName(nombre);
        }
      })
      .catch(() => {});
  }, [user]);

  // Carga pedidos en tiempo real desde Firebase
  useEffect(() => {
    if (!user?.uid || !db) {
      setOrdenes([
        {
          id: "d1",
          fecha: "15 Abr",
          items: 2,
          total: 22500,
          estado: "completado",
          tipo: "domicilio",
        },
        {
          id: "d2",
          fecha: "12 Abr",
          items: 3,
          total: 35000,
          estado: "completado",
          tipo: "anticipado",
        },
      ]);
      return;
    }
    setLoadingOrdenes(true);
    let unsub;
    try {
      const q = query(
        collection(db, "ordenes"),
        where("userId", "==", user.uid),
      );
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const ords = snapshot.docs
            .map((d) => {
              const data = d.data();
              return {
                id: d.id,
                ...data,
                fecha:
                  data.createdAt?.toDate?.().toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  }) || "—",
                _ts: data.createdAt?.toDate?.()?.getTime() || 0,
              };
            })
            .sort((a, b) => b._ts - a._ts);
          setOrdenes(ords);
          setLoadingOrdenes(false);
        },
        (err) => {
          console.error("Error cargando pedidos:", err.message);
          setLoadingOrdenes(false);
        },
      );
    } catch (err) {
      console.error("Error suscribiendo pedidos:", err.message);
      setLoadingOrdenes(false);
    }
    return () => unsub?.();
  }, [user]);

  // Carga direcciones guardadas del usuario
  useEffect(() => {
    if (!user?.uid || !db) return;
    const load = async () => {
      try {
        const snap = await getDocs(
          collection(db, `usuarios/${user.uid}/direcciones`),
        );
        const dirs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (dirs.length > 0) setDireccionesGuardadas(dirs);
      } catch {
        // continúa sin direcciones guardadas
      }
    };
    load();
  }, [user]);

  const guardarOrdenFirebase = async (ordenData) => {
    if (!db || !user?.uid) return null;
    try {
      const ref = await addDoc(collection(db, "ordenes"), {
        ...ordenData,
        userId: user.uid,
        createdAt: new Date(),
      });
      return ref.id;
    } catch (e) {
      console.error("Error guardando orden:", e);
      return null;
    }
  };

  const guardarDireccionFirebase = async () => {
    if (!direccion.trim()) {
      Alert.alert("Error", "Ingresa una dirección");
      return;
    }
    const nueva = {
      nombre: `Dirección ${direccionesGuardadas.length + 1}`,
      direccion: direccion.trim(),
      barrio: barrio.trim(),
    };
    setDireccionesGuardadas((prev) => [
      ...prev,
      { id: Date.now().toString(), ...nueva },
    ]);
    if (db && user?.uid) {
      try {
        await addDoc(collection(db, `usuarios/${user.uid}/direcciones`), nueva);
      } catch {
        // fallo silencioso
      }
    }
    Alert.alert("Guardada", "Dirección guardada correctamente");
  };

  const cancelarOrden = (orden) => {
    Alert.alert(
      "Cancelar pedido",
      "¿Seguro que quieres cancelar este pedido?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            if (db && user?.uid) {
              try {
                await updateDoc(doc(db, "ordenes", orden.id), {
                  estado: "cancelado",
                });
              } catch (e) {
                console.error("Error cancelando:", e.message);
              }
            }
            setOrdenes((prev) =>
              prev.map((o) =>
                o.id === orden.id ? { ...o, estado: "cancelado" } : o,
              ),
            );
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace("Login");
          } catch {
            Alert.alert("Error", "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  const handleExitApp = () => handleLogout();

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const calcularTotal = () =>
    cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const calcularPropina = () => Math.round((calcularTotal() * propina) / 100);

  const calcularTotalConPropina = () => calcularTotal() + calcularPropina();

  const obtenerItemsCarrito = () =>
    cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  const getFilteredMenuData = () => {
    if (activeCategory === "Todos") return menuData;
    const filtered = {};
    Object.entries(menuData).forEach(([section, items]) => {
      const filteredItems = items.filter((i) => i.categoria === activeCategory);
      if (filteredItems.length > 0) filtered[section] = filteredItems;
    });
    return filtered;
  };

  // ── Carrito ───────────────────────────────────────────────────────────────
  const agregarAlCarrito = (item) => {
    const idx = cartItems.findIndex((c) => c.nombre === item.nombre);
    if (idx >= 0) {
      setCartItems(
        cartItems.map((it, i) =>
          i === idx ? { ...it, cantidad: it.cantidad + 1 } : it,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        { nombre: item.nombre, cantidad: 1, precio: item.precio },
      ]);
    }
  };

  const aumentarCantidad = (index) => {
    setCartItems(
      cartItems.map((it, i) =>
        i === index ? { ...it, cantidad: it.cantidad + 1 } : it,
      ),
    );
  };

  const disminuirCantidad = (index) => {
    if (cartItems[index].cantidad === 1) {
      eliminarDelCarrito(index);
    } else {
      setCartItems(
        cartItems.map((it, i) =>
          i === index ? { ...it, cantidad: it.cantidad - 1 } : it,
        ),
      );
    }
  };

  const eliminarDelCarrito = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // ── Confirmaciones ────────────────────────────────────────────────────────
  const handleConfirmarDomicilio = async () => {
    if (!direccion.trim()) {
      Alert.alert("Error", "Ingresa una dirección de entrega");
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert("Error", "Tu carrito está vacío");
      return;
    }
    setSavingOrden(true);
    const nuevaOrden = {
      fecha: new Date().toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      }),
      items: obtenerItemsCarrito(),
      total: calcularTotalConPropina(),
      subtotal: calcularTotal(),
      propina: calcularPropina(),
      estado: "preparando",
      tipo: "domicilio",
      direccion,
      barrio,
      pago: pagoMethod,
      productos: cartItems,
    };
    const id = await guardarOrdenFirebase(nuevaOrden);
    setSavingOrden(false);
    if (!id) {
      setOrdenes((prev) => [
        { ...nuevaOrden, id: Date.now().toString() },
        ...prev,
      ]);
    }
    Alert.alert("¡Pedido confirmado!", "Tu domicilio está en preparación 🍽", [
      {
        text: "Ver mis pedidos",
        onPress: () => {
          setCartItems([]);
          setPropina(0);
          setActiveTab("mispedidos");
        },
      },
    ]);
  };

  const handleConfirmarAnticipado = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Tu carrito está vacío");
      return;
    }
    setSavingOrden(true);
    const nuevaOrden = {
      fecha: new Date().toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      }),
      items: obtenerItemsCarrito(),
      total: calcularTotalConPropina(),
      subtotal: calcularTotal(),
      propina: calcularPropina(),
      estado: "pendiente",
      tipo: "anticipado",
      pago: pagoMethod,
      contacto,
      productos: cartItems,
    };
    const id = await guardarOrdenFirebase(nuevaOrden);
    setSavingOrden(false);
    if (!id) {
      setOrdenes((prev) => [
        { ...nuevaOrden, id: Date.now().toString() },
        ...prev,
      ]);
    }
    Alert.alert(
      "¡Pedido anticipado confirmado!",
      "Te contactaremos pronto 📱",
      [
        {
          text: "Ver mis pedidos",
          onPress: () => {
            setCartItems([]);
            setPropina(0);
            setActiveTab("mispedidos");
          },
        },
      ],
    );
  };

  // ── Utilidades de estado ──────────────────────────────────────────────────
  const estadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "#9B59B6";
      case "preparando":
        return "#F39C12";
      case "en camino":
        return "#3498DB";
      case "entregado":
      case "completado":
        return "#2ECC71";
      case "cancelado":
        return "#E74C3C";
      default:
        return "#BBA060";
    }
  };

  const estadoIcon = (estado) => {
    switch (estado) {
      case "pendiente":
        return "⏳";
      case "preparando":
        return "🍳";
      case "en camino":
        return "🛵";
      case "entregado":
      case "completado":
        return "✓";
      case "cancelado":
        return "✗";
      default:
        return "⏳";
    }
  };

  // ── Componentes reutilizables ─────────────────────────────────────────────
  const TopBar = () => (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Text style={styles.topBarGreeting}>Hola,</Text>
        <Text style={styles.topBarName} numberOfLines={1}>
          {userName}
        </Text>
      </View>
      <TouchableOpacity onPress={handleExitApp} style={styles.exitBtn}>
        <Text style={styles.exitBtnText}>✕ Salir</Text>
      </TouchableOpacity>
    </View>
  );

  const PlatoCard = ({ item }) => (
    <View style={styles.platoCard}>
      <View style={styles.platoImg}>
        <Text style={styles.platoEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.platoInfo}>
        <Text style={styles.platoNombre}>{item.nombre}</Text>
        <Text style={styles.platoDesc}>{item.descripcion}</Text>
      </View>
      <View style={styles.platoRight}>
        <Text style={styles.platoPrecio}>${item.precio.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => agregarAlCarrito(item)}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TabBar = () => (
    <View style={styles.tabBar}>
      {[
        ["menu", "Menú"],
        ["anticipado", "Anticipado"],
        ["domicilio", "Domicilio"],
      ].map(([tab, label]) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.tabBtnText,
              activeTab === tab && styles.tabBtnTextActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      {[
        ["menu", "MEN", "Menú"],
        ["carrito", "🛒", "Carrito"],
        ["mispedidos", "PED", "Mis pedidos"],
      ].map(([tab, icon, label]) => (
        <TouchableOpacity
          key={tab}
          style={styles.navItem}
          onPress={() => setActiveTab(tab)}
        >
          <View>
            <Text
              style={[
                styles.navIcon,
                activeTab === tab && styles.navIconActive,
              ]}
            >
              {icon}
            </Text>
            {tab === "carrito" && obtenerItemsCarrito() > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{obtenerItemsCarrito()}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === tab && styles.navLabelActive,
            ]}
          >
            {label}
          </Text>
          {activeTab === tab && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const HeaderLogo = ({ title, subtitle }) => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo_lapampa.jpg")}
          style={styles.logoImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {activeTab === "menu" && (
        <View style={styles.cartBadge}>
          <View style={styles.dot} />
          <Text style={styles.cartCount}>{obtenerItemsCarrito()}</Text>
        </View>
      )}
    </View>
  );

  const ResumenPedido = () => (
    <View style={styles.resumenCard}>
      {cartItems.map((item, idx) => (
        <View key={idx} style={styles.resumenRow}>
          <Text style={styles.resumenNombre}>
            {item.nombre} x{item.cantidad}
          </Text>
          <Text style={styles.resumenPrecio}>
            ${(item.precio * item.cantidad).toLocaleString()}
          </Text>
        </View>
      ))}
      {propina > 0 && (
        <View style={styles.resumenRow}>
          <Text style={styles.resumenNombre}>Propina ({propina}%)</Text>
          <Text style={styles.resumenPrecio}>
            +${calcularPropina().toLocaleString()}
          </Text>
        </View>
      )}
      <View style={styles.resumenTotal}>
        <Text style={styles.resumenTotalLabel}>TOTAL</Text>
        <Text style={styles.resumenTotalValue}>
          ${calcularTotalConPropina().toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const MetodoPago = () => (
    <>
      <Text style={styles.sectionLabel}>MÉTODO DE PAGO</Text>
      <View style={styles.pagoOpts}>
        {["Efectivo", "Nequi", "Daviplata"].map((metodo) => (
          <TouchableOpacity
            key={metodo}
            style={[
              styles.pagoOpt,
              pagoMethod === metodo && styles.pagoOptSelected,
            ]}
            onPress={() => setPagoMethod(metodo)}
          >
            <View
              style={[
                styles.pagoOptBox,
                pagoMethod === metodo && styles.pagoOptBoxSelected,
              ]}
            />
            <Text style={styles.pagoOptText}>{metodo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <TopBar />

      {/* --- MENU --- */}
      {activeTab === "menu" && (
        <>
          <HeaderLogo title="LA PAMPA" subtitle="Menú · Pacífico colombiano" />
          <TabBar />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  activeCategory === cat && styles.catChipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.catChipText,
                    activeCategory === cat && styles.catChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.scrollContent}>
            {Object.entries(getFilteredMenuData()).map(([section, items]) => (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionLabel}>{section}</Text>
                {items.map((item) => (
                  <PlatoCard key={item.id} item={item} />
                ))}
              </View>
            ))}
            {Object.keys(getFilteredMenuData()).length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Sin platos en esta categoría
                </Text>
              </View>
            )}
            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.cartBar}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartInfoMain}>
                {obtenerItemsCarrito()} ítems en tu orden
              </Text>
              <Text style={styles.cartInfoSub}>
                Total: ${calcularTotal().toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cartViewBtn}
              onPress={() => setActiveTab("carrito")}
            >
              <Text style={styles.cartViewBtnText}>VER ORDEN</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* --- CARRITO EDITABLE --- */}
      {activeTab === "carrito" && (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setActiveTab("menu")}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>← Menú</Text>
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>MI CARRITO</Text>
              <Text style={styles.headerSubtitle}>
                {obtenerItemsCarrito()} ítems
              </Text>
            </View>
          </View>

          <ScrollView style={styles.scrollContent}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Tu carrito está vacío</Text>
                <TouchableOpacity
                  onPress={() => setActiveTab("menu")}
                  style={[styles.confirmBtn, { marginTop: 16 }]}
                >
                  <Text style={styles.confirmBtnText}>VER MENÚ</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Items editables */}
                <Text style={styles.sectionLabel}>TU PEDIDO</Text>
                {cartItems.map((item, index) => (
                  <View key={index} style={styles.cartItemCard}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemNombre}>{item.nombre}</Text>
                      <Text style={styles.cartItemUnitPrice}>
                        ${item.precio.toLocaleString()} c/u
                      </Text>
                    </View>
                    <View style={styles.cartItemControls}>
                      <TouchableOpacity
                        onPress={() => disminuirCantidad(index)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.cantidad}</Text>
                      <TouchableOpacity
                        onPress={() => aumentarCantidad(index)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => eliminarDelCarrito(index)}
                        style={styles.deleteBtn}
                      >
                        <Text style={styles.deleteBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cartItemTotal}>
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </Text>
                  </View>
                ))}

                {/* Propina */}
                <Text style={styles.sectionLabel}>PROPINA</Text>
                <View style={styles.propinaOpts}>
                  {[0, 10, 15, 20].map((pct) => (
                    <TouchableOpacity
                      key={pct}
                      style={[
                        styles.propinaOpt,
                        propina === pct && styles.propinaOptActive,
                      ]}
                      onPress={() => setPropina(pct)}
                    >
                      <Text
                        style={[
                          styles.propinaOptText,
                          propina === pct && styles.propinaOptTextActive,
                        ]}
                      >
                        {pct === 0 ? "Sin\npropina" : `${pct}%`}
                      </Text>
                      {pct > 0 && (
                        <Text
                          style={[
                            styles.propinaOptAmount,
                            propina === pct && styles.propinaOptAmountActive,
                          ]}
                        >
                          +$
                          {Math.round(
                            (calcularTotal() * pct) / 100,
                          ).toLocaleString()}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Totales */}
                <View style={styles.resumenCard}>
                  <View style={styles.resumenRow}>
                    <Text style={styles.resumenNombre}>Subtotal</Text>
                    <Text style={styles.resumenPrecio}>
                      ${calcularTotal().toLocaleString()}
                    </Text>
                  </View>
                  {propina > 0 && (
                    <View style={styles.resumenRow}>
                      <Text style={styles.resumenNombre}>
                        Propina ({propina}%)
                      </Text>
                      <Text style={styles.resumenPrecio}>
                        +${calcularPropina().toLocaleString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.resumenTotal}>
                    <Text style={styles.resumenTotalLabel}>TOTAL</Text>
                    <Text style={styles.resumenTotalValue}>
                      ${calcularTotalConPropina().toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Cómo pedir */}
                <Text style={styles.sectionLabel}>¿CÓMO DESEAS TU PEDIDO?</Text>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => setActiveTab("domicilio")}
                >
                  <Text style={styles.confirmBtnText}>
                    🛵 SOLICITAR DOMICILIO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, styles.confirmBtnSecondary]}
                  onPress={() => setActiveTab("anticipado")}
                >
                  <Text
                    style={[
                      styles.confirmBtnText,
                      styles.confirmBtnTextSecondary,
                    ]}
                  >
                    📋 PEDIDO ANTICIPADO
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <View style={{ height: 30 }} />
          </ScrollView>

          <BottomNav />
        </>
      )}

      {/* --- PEDIDO ANTICIPADO --- */}
      {activeTab === "anticipado" && (
        <>
          <HeaderLogo
            title="PEDIDO ANTICIPADO"
            subtitle="La Pampa · Cali, La Primavera"
          />
          <TouchableOpacity
            onPress={() => setActiveTab("carrito")}
            style={styles.backToCartBar}
          >
            <Text style={styles.backToCartText}>← Volver al carrito</Text>
          </TouchableOpacity>

          <ScrollView style={styles.scrollContent}>
            <Text style={styles.sectionLabel}>RESUMEN DEL PEDIDO</Text>
            <ResumenPedido />
            <MetodoPago />

            <Text style={styles.fieldLabel}>CONTACTO</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="300 123 4567"
                placeholderTextColor="#BBA060"
                value={contacto}
                onChangeText={setContacto}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                savingOrden && styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirmarAnticipado}
              disabled={savingOrden}
            >
              {savingOrden ? (
                <ActivityIndicator color="#1C0D03" />
              ) : (
                <Text style={styles.confirmBtnText}>CONFIRMAR PEDIDO</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>

          <BottomNav />
        </>
      )}

      {/* --- DOMICILIO --- */}
      {activeTab === "domicilio" && (
        <>
          <HeaderLogo
            title="SOLICITAR DOMICILIO"
            subtitle="La Pampa · Cali, La Primavera"
          />
          <TouchableOpacity
            onPress={() => setActiveTab("carrito")}
            style={styles.backToCartBar}
          >
            <Text style={styles.backToCartText}>← Volver al carrito</Text>
          </TouchableOpacity>

          <ScrollView style={styles.scrollContent}>
            <Text style={styles.sectionLabel}>DIRECCIÓN DE ENTREGA</Text>

            {/* Direcciones guardadas */}
            {direccionesGuardadas.length > 0 && (
              <>
                <Text style={styles.fieldLabel}>MIS DIRECCIONES GUARDADAS</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 10 }}
                >
                  {direccionesGuardadas.map((dir) => (
                    <TouchableOpacity
                      key={dir.id}
                      style={[
                        styles.dirChip,
                        direccion === dir.direccion && styles.dirChipActive,
                      ]}
                      onPress={() => {
                        setDireccion(dir.direccion);
                        setBarrio(dir.barrio || "");
                      }}
                    >
                      <Text
                        style={[
                          styles.dirChipNombre,
                          direccion === dir.direccion &&
                            styles.dirChipNombreActive,
                        ]}
                      >
                        {dir.nombre}
                      </Text>
                      <Text style={styles.dirChipAddr}>{dir.direccion}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>DIRECCIÓN</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Cra 5 # 18-40, Cali"
                  placeholderTextColor="#BBA060"
                  value={direccion}
                  onChangeText={setDireccion}
                />
              </View>

              <Text style={styles.fieldLabel}>BARRIO / REFERENCIA</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Barrio San Fernando"
                  placeholderTextColor="#BBA060"
                  value={barrio}
                  onChangeText={setBarrio}
                />
              </View>

              <TouchableOpacity
                style={styles.saveDirBtn}
                onPress={guardarDireccionFirebase}
              >
                <Text style={styles.saveDirBtnText}>
                  + Guardar esta dirección
                </Text>
              </TouchableOpacity>

              <View style={styles.mapBox}>
                <Text style={styles.mapBoxTitle}>Mapa de ubicación</Text>
                <Text style={styles.mapBoxSubtitle}>
                  Google Maps · integración futura
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>RESUMEN DEL PEDIDO</Text>
            <ResumenPedido />
            <MetodoPago />

            <Text style={styles.fieldLabel}>CONTACTO</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="300 123 4567"
                placeholderTextColor="#BBA060"
                value={contacto}
                onChangeText={setContacto}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                savingOrden && styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirmarDomicilio}
              disabled={savingOrden}
            >
              {savingOrden ? (
                <ActivityIndicator color="#1C0D03" />
              ) : (
                <Text style={styles.confirmBtnText}>CONFIRMAR DOMICILIO</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>

          <BottomNav />
        </>
      )}

      {/* --- MIS PEDIDOS --- */}
      {activeTab === "mispedidos" && (
        <>
          <HeaderLogo
            title="MIS PEDIDOS"
            subtitle="La Pampa · Historial de órdenes"
          />

          <ScrollView style={styles.scrollContent}>
            {loadingOrdenes ? (
              <ActivityIndicator
                color="#E8A020"
                style={{ marginTop: 40 }}
                size="large"
              />
            ) : ordenes.length > 0 ? (
              ordenes.map((orden) => (
                <View key={orden.id} style={styles.pedidoCard}>
                  <View style={styles.pedidoIconContainer}>
                    <Text style={styles.pedidoIcon}>
                      {estadoIcon(orden.estado)}
                    </Text>
                  </View>
                  <View style={styles.pedidoInfo}>
                    <Text style={styles.pedidoDate}>{orden.fecha}</Text>
                    <Text style={styles.pedidoItems}>
                      {orden.items} artículo{orden.items !== 1 ? "s" : ""} ·{" "}
                      {orden.tipo === "domicilio"
                        ? "Domicilio"
                        : orden.tipo === "anticipado"
                          ? "Anticipado"
                          : orden.tipo || "—"}
                    </Text>
                    {orden.estado === "pendiente" && (
                      <Text
                        style={[styles.pedidoTracking, { color: "#9B59B6" }]}
                      >
                        Esperando confirmación...
                      </Text>
                    )}
                    {orden.estado === "preparando" && (
                      <Text style={styles.pedidoTracking}>
                        Preparando tu pedido...
                      </Text>
                    )}
                    {orden.estado === "en camino" && (
                      <Text
                        style={[styles.pedidoTracking, { color: "#3498DB" }]}
                      >
                        Tu pedido está en camino
                      </Text>
                    )}
                    {(orden.estado === "pendiente" ||
                      orden.estado === "preparando") && (
                      <TouchableOpacity
                        onPress={() => cancelarOrden(orden)}
                        style={styles.cancelarBtn}
                      >
                        <Text style={styles.cancelarBtnText}>
                          Cancelar pedido
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.pedidoRight}>
                    <Text style={styles.pedidoTotal}>
                      ${orden.total?.toLocaleString()}
                    </Text>
                    <View
                      style={[
                        styles.pedidoEstado,
                        { backgroundColor: estadoColor(orden.estado) },
                      ]}
                    >
                      <Text style={styles.pedidoEstadoText}>
                        {orden.estado?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Sin pedidos aún</Text>
                <TouchableOpacity
                  onPress={() => setActiveTab("menu")}
                  style={[styles.confirmBtn, { marginTop: 16 }]}
                >
                  <Text style={styles.confirmBtnText}>IR AL MENÚ</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{ height: 30 }} />
          </ScrollView>

          <BottomNav />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6E3",
  },
  // Header
  header: {
    backgroundColor: "#1C0D03",
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  headerInfo: {
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#C4860E",
    marginTop: 2,
  },
  cartBadge: {
    backgroundColor: "#E8A020",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1C0D03",
  },
  cartCount: {
    fontSize: 9,
    fontWeight: "700",
    color: "#1C0D03",
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 2,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#E8A020",
  },
  // Tab Bar
  tabBar: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: "#EDD99A",
    borderRadius: 8,
    padding: 3,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: "#1C0D03",
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7A4800",
  },
  tabBtnTextActive: {
    color: "#E8A020",
  },
  // Categories
  categoriesContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
    maxHeight: 36,
  },
  categoriesList: {
    gap: 4,
    paddingRight: 12,
  },
  catChip: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
  },
  catChipActive: {
    backgroundColor: "#1C0D03",
  },
  catChipText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#7A4800",
  },
  catChipTextActive: {
    color: "#E8A020",
  },
  // Scroll Content
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 6,
  },
  // Plato Card
  platoCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 10,
    padding: 9,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  platoImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#EDD99A",
    justifyContent: "center",
    alignItems: "center",
  },
  platoEmoji: {
    fontSize: 20,
  },
  platoInfo: {
    flex: 1,
  },
  platoNombre: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C0D03",
  },
  platoDesc: {
    fontSize: 8,
    color: "#8B6000",
    marginTop: 1,
    lineHeight: 11,
  },
  platoRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  platoPrecio: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C0D03",
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8A020",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C0D03",
    lineHeight: 14,
  },
  // Cart Bar
  cartBar: {
    backgroundColor: "#1C0D03",
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartInfo: {},
  cartInfoMain: {
    fontSize: 10,
    fontWeight: "700",
    color: "#E8A020",
  },
  cartInfoSub: {
    fontSize: 8,
    color: "#C4860E",
    marginTop: 2,
  },
  cartViewBtn: {
    backgroundColor: "#E8A020",
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  cartViewBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 1,
  },
  // Cart Item Editable
  cartItemCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemNombre: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C0D03",
  },
  cartItemUnitPrice: {
    fontSize: 9,
    color: "#8B6000",
    marginTop: 2,
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EDD99A",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C0D03",
    lineHeight: 16,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C0D03",
    minWidth: 18,
    textAlign: "center",
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFE0E0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  deleteBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C0392B",
  },
  cartItemTotal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E8A020",
    minWidth: 60,
    textAlign: "right",
  },
  // Propina
  propinaOpts: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 12,
  },
  propinaOpt: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#EDD99A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  propinaOptActive: {
    borderColor: "#E8A020",
    backgroundColor: "#FFF8EC",
  },
  propinaOptText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
    textAlign: "center",
  },
  propinaOptTextActive: {
    color: "#1C0D03",
  },
  propinaOptAmount: {
    fontSize: 8,
    color: "#BBA060",
    textAlign: "center",
  },
  propinaOptAmountActive: {
    color: "#E8A020",
    fontWeight: "700",
  },
  // Form Styles
  formSection: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#8B6000",
    letterSpacing: 1,
    marginBottom: 3,
  },
  inputContainer: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#D4A843",
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },
  inputIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E8A020",
  },
  input: {
    flex: 1,
    fontSize: 10,
    color: "#1C0D03",
    padding: 0,
  },
  mapBox: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#D4A843",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  mapBoxTitle: {
    fontSize: 9,
    fontWeight: "700",
    color: "#8B6000",
  },
  mapBoxSubtitle: {
    fontSize: 8,
    color: "#C4860E",
  },
  // Saved Addresses
  dirChip: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#EDD99A",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    minWidth: 100,
  },
  dirChipActive: {
    borderColor: "#E8A020",
    backgroundColor: "#FFF8EC",
  },
  dirChipNombre: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
    marginBottom: 1,
  },
  dirChipNombreActive: {
    color: "#1C0D03",
  },
  dirChipAddr: {
    fontSize: 8,
    color: "#BBA060",
  },
  saveDirBtn: {
    borderWidth: 1.5,
    borderColor: "#E8A020",
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveDirBtnText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#E8A020",
  },
  // Resumen
  resumenCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EDD99A",
  },
  resumenNombre: {
    fontSize: 10,
    color: "#1C0D03",
  },
  resumenPrecio: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
  },
  resumenTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: "#E8A020",
  },
  resumenTotalLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    letterSpacing: 1,
  },
  resumenTotalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C0D03",
  },
  // Pago Options
  pagoOpts: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 12,
  },
  pagoOpt: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#EDD99A",
    borderRadius: 7,
    alignItems: "center",
    gap: 2,
  },
  pagoOptSelected: {
    borderColor: "#E8A020",
    backgroundColor: "#FFF8EC",
  },
  pagoOptBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#EDD99A",
  },
  pagoOptBoxSelected: {
    backgroundColor: "#E8A020",
  },
  pagoOptText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
  },
  // Buttons
  confirmBtn: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#E8A020",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 2,
  },
  confirmBtnSecondary: {
    backgroundColor: "#5C3300",
  },
  confirmBtnTextSecondary: {
    color: "#EDD99A",
  },
  confirmBtnDisabled: {
    backgroundColor: "#BBA060",
  },
  // Bottom Nav
  bottomNav: {
    backgroundColor: "#1C0D03",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  navIcon: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
  },
  navIconActive: {
    color: "#E8A020",
  },
  navLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "#5C3300",
  },
  navLabelActive: {
    color: "#E8A020",
  },
  navDot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#E8A020",
  },
  navBadge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#E8A020",
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  navBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#1C0D03",
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8B6000",
    fontWeight: "600",
  },
  // Pedidos
  pedidoCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pedidoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF8EC",
    borderWidth: 1,
    borderColor: "#EDD99A",
    justifyContent: "center",
    alignItems: "center",
  },
  pedidoIcon: {
    fontSize: 16,
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C0D03",
  },
  pedidoItems: {
    fontSize: 11,
    color: "#8B6000",
    marginTop: 2,
  },
  pedidoTracking: {
    fontSize: 9,
    color: "#F39C12",
    marginTop: 3,
    fontWeight: "600",
  },
  pedidoRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  pedidoTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8A020",
  },
  pedidoEstado: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pedidoEstadoText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  cancelarBtn: {
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E74C3C",
    alignSelf: "flex-start",
  },
  cancelarBtnText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#E74C3C",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C0D03",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3D1F00",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    flex: 1,
  },
  topBarGreeting: {
    fontSize: 11,
    color: "#C4860E",
    fontWeight: "400",
  },
  topBarName: {
    fontSize: 13,
    color: "#E8A020",
    fontWeight: "700",
    flexShrink: 1,
  },
  exitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#5C3300",
  },
  exitBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C4860E",
  },
  backToCartBar: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#EDD99A",
  },
  backToCartText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
  },
});
