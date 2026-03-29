import { Product, Table, Waiter } from './types';

export const SAUCES = ['BBQ', 'Bufalo', 'BBQ Habanero', 'Mango Habanero'];

// --- LISTAS DE INGREDIENTES (menú Veneto's LM, PDF actualizado) ---
export const HAMBURGER_INGREDIENTS = [
  'Carne', 'Queso americano', 'Queso chihuahua', 'Queso philadelphia',
  'Mayonesa', 'Lechuga', 'Cebolla cruda', 'Cebolla asada', 'Tomate', 'Chile',
  'Mostaza', 'Catsup', 'Aguacate', 'Tocino frito', 'Jamón', 'Piña', 'BBQ',
  'Aros de cebolla', 'Salchicha con tocino', 'Doble carne',
  'Boneless (salsa a elegir)', 'Queso de la casa (gratinado)',
];

const HOTDOG_PACENO_INGREDIENTS = [
  'Salchicha con tocino', 'Cebolla asada', 'Cebolla cruda', 'Chile',
  'Mostaza', 'Tomate', 'Crema', 'Catsup',
];

const HOTDOG_NORMAL_INGREDIENTS = [
  'Salchicha con tocino', 'Mayonesa', 'Cebolla asada', 'Cebolla cruda',
  'Mostaza', 'Chile', 'Cheeswiz', 'Tomate', 'Aguacate', 'Catsup', 'Queso rallado',
  'Jamón', 'Queso chihuahua', 'Queso philadelphia', 'Queso americano',
  'Carne asada', 'Carne de hamburguesa', 'Chile anaheim con queso chihuahua',
  'Costra de queso chihuahua', 'Salchicha interior (embarazado)', 'Boneless', 'Ranch',
];

export const HOTDOG_INGREDIENTS = Array.from(
  new Set([...HOTDOG_PACENO_INGREDIENTS, ...HOTDOG_NORMAL_INGREDIENTS])
);

const PAPAS_BONELESS_INGREDIENTS = ['Ranch', 'Chipotle', 'Queso parmesano', 'Salsa a elegir'];

const ENSALADA_BONELESS_INGREDIENTS = [
  'Lechuga', 'Tomate', 'Pepino', 'Zanahoria', 'Apio', 'Crotones',
  'Parmesano', 'Ranch', 'Boneless (salsa a elegir)',
];

const TORTA_INGREDIENTS = [
  'Carne asada', 'Jamón', 'Queso chihuahua', 'Mayonesa', 'Lechuga', 'Tomate',
  'Cebolla asada', 'Cebolla cruda', 'Mostaza', 'Catsup', 'Chile', 'Aguacate',
];

const allIngredients = new Set([
  ...HAMBURGER_INGREDIENTS,
  ...HOTDOG_INGREDIENTS,
  ...PAPAS_BONELESS_INGREDIENTS,
  ...ENSALADA_BONELESS_INGREDIENTS,
  ...TORTA_INGREDIENTS,
]);
export const CUSTOMIZABLE_INGREDIENTS = Array.from(allIngredients);

export const WAITERS: Waiter[] = [
  { id: 'w1', name: 'Juan', pin: '1234' },
  { id: 'w2', name: 'Maria', pin: '5678' },
  { id: 'w3', name: 'Carlos', pin: '1111' },
  { id: 'w4', name: 'Ana', pin: '2222' },
];

export const MENU_ITEMS: Product[] = [
  { id: 'ham_1', name: 'Clásica', price: 85, category: 'Hamburguesas' },
  { id: 'ham_2', name: 'Clásica c/ Salchicha', price: 95, category: 'Hamburguesas' },
  { id: 'ham_3', name: '3 Quesos', price: 105, category: 'Hamburguesas' },
  { id: 'ham_4', name: 'Doble', price: 130, category: 'Hamburguesas' },
  { id: 'ham_5', name: 'Hawaiana', price: 105, category: 'Hamburguesas' },
  { id: 'ham_6', name: 'Tocino', price: 105, category: 'Hamburguesas' },
  { id: 'ham_7', name: 'Monster', price: 155, category: 'Hamburguesas' },
  { id: 'ham_8', name: 'Hamburguesa del Cheff', price: 130, category: 'Hamburguesas' },
  { id: 'ham_9', name: 'Hamburguesa Bonelees', price: 130, category: 'Hamburguesas' },

  { id: 'hd_1', name: 'Paceño', price: 40, category: 'Hotdogs' },
  { id: 'hd_2', name: 'Paceño c/ Papas', price: 60, category: 'Hotdogs' },
  { id: 'hd_3', name: 'Normal', price: 45, category: 'Hotdogs' },
  { id: 'hd_4', name: 'Normal c/ Papas', price: 65, category: 'Hotdogs' },
  { id: 'hd_5', name: 'Especial', price: 50, category: 'Hotdogs' },
  { id: 'hd_6', name: 'Especial c/ Papas', price: 70, category: 'Hotdogs' },
  { id: 'hd_7', name: 'Embarazado', price: 65, category: 'Hotdogs' },
  { id: 'hd_8', name: 'Embarazado c/ Papas', price: 85, category: 'Hotdogs' },
  { id: 'hd_9', name: 'Costri Dogo', price: 55, category: 'Hotdogs' },
  { id: 'hd_10', name: 'Costri Dogo c/ Papas', price: 75, category: 'Hotdogs' },
  { id: 'hd_11', name: 'Asada', price: 75, category: 'Hotdogs' },
  { id: 'hd_12', name: 'Asada c/ Papas', price: 95, category: 'Hotdogs' },
  { id: 'hd_13', name: 'Tres Quesos', price: 60, category: 'Hotdogs' },
  { id: 'hd_14', name: 'Tres Quesos c/ Papas', price: 80, category: 'Hotdogs' },
  { id: 'hd_15', name: 'Dogo Burguer', price: 75, category: 'Hotdogs' },
  { id: 'hd_16', name: 'Dogo Burguer c/ Papas', price: 95, category: 'Hotdogs' },
  { id: 'hd_17', name: 'Chilidogo', price: 55, category: 'Hotdogs' },
  { id: 'hd_18', name: 'Chilidogo c/ Papas', price: 75, category: 'Hotdogs' },
  { id: 'hd_19', name: 'Dogo Bonelees', price: 75, category: 'Hotdogs' },
  { id: 'hd_20', name: 'Dogo Bonelees c/ Papas', price: 90, category: 'Hotdogs' },

  { id: 'tor_1', name: 'Torta c/ Papas', price: 90, category: 'Tortas' },

  { id: 'bn_1', name: 'Boneless Orden (250 gr)', price: 120, category: 'Boneless' },
  { id: 'bn_2', name: 'Orden de Aros de Cebolla', price: 70, category: 'Papas' },
  { id: 'bn_3', name: 'Papas Bonelees', price: 150, category: 'Boneless' },
  { id: 'bn_5', name: 'Ensalada Bonelees', price: 160, category: 'Boneless' },

  { id: 'al_1', name: 'Alitas 10 Piezas', price: 110, category: 'Alitas' },
  { id: 'al_2', name: 'Alitas 20 Piezas', price: 200, category: 'Alitas' },

  { id: 'pa_1', name: 'Orden de Papas', price: 50, category: 'Papas' },
  { id: 'pa_2', name: 'Salchipapas', price: 70, category: 'Papas' },
  { id: 'pa_3', name: 'Salchipapas c/ Carne', price: 100, category: 'Papas' },
  { id: 'pa_4', name: 'Salchipapas c/ Carne Gratinadas', price: 115, category: 'Papas' },

  { id: 'sl_1', name: 'Salchicha Sola', price: 15, category: 'Salchichas' },
  { id: 'sl_2', name: 'Salchicha Preparada', price: 30, category: 'Salchichas' },
  { id: 'sl_3', name: 'Salchicha Preparada (Jamón y Queso)', price: 40, category: 'Salchichas' },
  { id: 'sl_4', name: 'Salchicha Embarazada Preparada', price: 55, category: 'Salchichas' },

  { id: 'beb_1', name: 'Coca', price: 30, category: 'Bebidas' },
  { id: 'beb_1b', name: 'Coca Zero', price: 30, category: 'Bebidas' },
  { id: 'beb_1c', name: 'Sprite', price: 30, category: 'Bebidas' },
  { id: 'beb_2', name: 'Té Jazmín de la casa', price: 25, category: 'Bebidas' },
  { id: 'beb_3', name: 'Agua Natural', price: 15, category: 'Bebidas' },
  { id: 'beb_4', name: 'Litro de Té', price: 45, category: 'Bebidas' },
  { id: 'beb_5', name: 'Naranjita', price: 25, category: 'Bebidas' },

  // Extras
  { id: 'ex_ranch', name: 'Extra Ranch', price: 15, category: 'Extras' },
  { id: 'ex_chipotle', name: 'Extra Chipotle', price: 15, category: 'Extras' },
  { id: 'ex_custom', name: 'Extra Personalizable', price: 0, category: 'Extras' },
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  label: `Mesa ${i + 1}`,
  status: 'AVAILABLE',
  currentOrderId: null,
}));
