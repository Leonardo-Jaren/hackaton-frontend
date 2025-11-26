import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaCheckCircle, FaTimes } from 'react-icons/fa';

const SIDEBAR_CATEGORIES = [
	{ key: 'general', label: 'General' },
	{ key: 'empresa', label: 'Empresa/Perfil' },
	{ key: 'usuarios', label: 'Usuarios & Seguridad' },
	{ key: 'transacciones', label: 'Transacciones' },
	{ key: 'cierre', label: 'Cierre de Caja' },
	{ key: 'reportes', label: 'Reportes' },
	{ key: 'preferencias', label: 'Preferencias' },
	{ key: 'integraciones', label: 'Integraciones' },
];

const initialForm = {
	nombre: 'Mi Negocio',
	telefono: '+51 987654321',
	direccion: 'Calle Principal 123, Huánuco',
	moneda: 'PEN',
	zonaHoraria: 'America/Lima',
	logo: '',
	notificaciones: true,
	modoOscuro: true,
};

const monedas = [
	{ value: 'PEN', label: 'PEN (Soles)' },
	{ value: 'USD', label: 'USD (Dólares)' },
	{ value: 'EUR', label: 'EUR (Euros)' },
];

const zonasHorarias = [
	'America/Lima',
	'America/Bogota',
	'America/Mexico_City',
	'America/Santiago',
	'America/Argentina/Buenos_Aires',
];

const Settings: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [activeCategory, setActiveCategory] = useState('general');
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({ general: true });
	const [form, setForm] = useState(initialForm);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Validación simple en tiempo real
	const validate = (field: string, value: string) => {
		let error = '';
		if (field === 'nombre' && !value.trim()) error = 'El nombre es obligatorio';
		if (field === 'telefono' && !/^\+\d{1,3} ?\d{6,}$/.test(value)) error = 'Teléfono inválido';
		if (field === 'direccion' && !value.trim()) error = 'La dirección es obligatoria';
		setErrors((prev) => ({ ...prev, [field]: error }));
		return error;
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const target = e.target as HTMLInputElement | HTMLSelectElement;
		const { name, value, type } = target;
		let val: string | boolean = value;
		if (type === 'checkbox') {
			val = (target as HTMLInputElement).checked;
		}
		setForm((prev) => ({ ...prev, [name]: val }));
		validate(name, String(val));
	};

	const handleSectionToggle = (key: string) => {
		setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

	const handleCategory = (key: string) => {
		setActiveCategory(key);
		setSidebarOpen(false);
		setExpandedSections((prev) => ({ ...prev, [key]: true }));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		let hasError = false;
		Object.entries(form).forEach(([k, v]) => {
			if (typeof v === 'string') {
				if (validate(k, v)) hasError = true;
			}
		});
		if (hasError) return;
		setSaving(true);
		setTimeout(() => {
			setSaving(false);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		}, 1200);
	};

	// Filtrado de categorías por buscador
	const filteredCategories = SIDEBAR_CATEGORIES.filter((cat) =>
		cat.label.toLowerCase().includes(search.toLowerCase())
	);

	// Estilos principales (tailwind + custom)
	return (
		<div className="min-h-screen bg-[#181c23] flex flex-col md:flex-row text-gray-100">
			{/* Sidebar */}
			<aside
				className={`z-20 md:static fixed top-0 left-0 h-full w-64 bg-[#232936] shadow-lg transition-transform duration-300 md:translate-x-0 ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				}`}
			>
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#2c3240]">
					<span className="font-bold text-xl text-white">Configuración</span>
					<button
						className="md:hidden text-gray-300 hover:text-white"
						onClick={handleSidebarToggle}
						aria-label="Cerrar menú"
					>
						<FaTimes />
					</button>
				</div>
				<div className="px-4 py-3">
					<div className="relative mb-4">
						<FaSearch className="absolute left-3 top-3 text-gray-400" />
						<input
							className="w-full pl-10 pr-3 py-2 rounded bg-[#232936] border border-[#2c3240] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Buscar configuración..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<nav className="flex flex-col gap-1">
						{filteredCategories.map((cat) => (
							<button
								key={cat.key}
								className={`text-left px-4 py-2 rounded font-medium transition-colors ${
									activeCategory === cat.key
										? 'bg-blue-700 text-white shadow'
										: 'hover:bg-[#1a1e25] text-gray-300'
								}`}
								onClick={() => handleCategory(cat.key)}
							>
								{cat.label}
							</button>
						))}
					</nav>
				</div>
			</aside>

			{/* Overlay móvil */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
					onClick={handleSidebarToggle}
				/>
			)}

			{/* Área principal */}
			<main className="flex-1 p-4 md:p-8 overflow-y-auto">
				{/* Botón menú móvil */}
				<button
					className="md:hidden mb-4 px-4 py-2 bg-blue-700 text-white rounded shadow flex items-center gap-2"
					onClick={handleSidebarToggle}
				>
					<span>Menú</span>
				</button>

				{/* Notificación de guardado */}
				{saved && (
					<div className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-600 text-white rounded shadow animate-fade-in">
						<FaCheckCircle /> Cambios guardados exitosamente
					</div>
				)}

				{/* Secciones expandibles */}
				{activeCategory === 'general' && (
					<section className="mb-8">
						<div
							className="flex items-center justify-between cursor-pointer mb-2"
							onClick={() => handleSectionToggle('general')}
						>
							<h2 className="text-2xl font-bold text-white">Información de Negocio</h2>
							{expandedSections['general'] ? (
								<FaChevronUp className="text-blue-400" />
							) : (
								<FaChevronDown className="text-blue-400" />
							)}
						</div>
						{expandedSections['general'] && (
							<form
								className="bg-[#232936] rounded-lg shadow-lg p-6 flex flex-col gap-6 border border-[#2c3240] max-w-xl"
								onSubmit={handleSave}
							>
								{/* Logo */}
								<div>
									<label className="block text-gray-300 font-semibold mb-1">Logo</label>
									<input
										type="file"
										name="logo"
										accept="image/*"
										className="block w-full text-gray-200 bg-[#232936] border border-[#2c3240] rounded px-3 py-2"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) setForm((prev) => ({ ...prev, logo: file.name }));
										}}
									/>
									{form.logo && (
										<span className="text-xs text-green-400 mt-1 inline-block">{form.logo}</span>
									)}
								</div>
								{/* Nombre */}
								<div>
									<label className="block text-gray-300 font-semibold mb-1">Nombre del Negocio</label>
									<input
										type="text"
										name="nombre"
										value={form.nombre}
										onChange={handleInput}
										className={`w-full px-3 py-2 rounded bg-[#232936] border ${
											errors.nombre ? 'border-red-500' : 'border-[#2c3240]'
										} text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
									/>
									{errors.nombre && <span className="text-xs text-red-400">{errors.nombre}</span>}
								</div>
								{/* Teléfono */}
								<div>
									<label className="block text-gray-300 font-semibold mb-1">Teléfono</label>
									<input
										type="text"
										name="telefono"
										value={form.telefono}
										onChange={handleInput}
										className={`w-full px-3 py-2 rounded bg-[#232936] border ${
											errors.telefono ? 'border-red-500' : 'border-[#2c3240]'
										} text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
									/>
									{errors.telefono && <span className="text-xs text-red-400">{errors.telefono}</span>}
								</div>
								{/* Dirección */}
								<div>
									<label className="block text-gray-300 font-semibold mb-1">Dirección</label>
									<input
										type="text"
										name="direccion"
										value={form.direccion}
										onChange={handleInput}
										className={`w-full px-3 py-2 rounded bg-[#232936] border ${
											errors.direccion ? 'border-red-500' : 'border-[#2c3240]'
										} text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
									/>
									{errors.direccion && <span className="text-xs text-red-400">{errors.direccion}</span>}
								</div>
								{/* Moneda y Zona Horaria */}
								<div className="flex gap-4">
									<div className="flex-1">
										<label className="block text-gray-300 font-semibold mb-1">Moneda</label>
										<select
											name="moneda"
											value={form.moneda}
											onChange={handleInput}
											className="w-full px-3 py-2 rounded bg-[#232936] border border-[#2c3240] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											{monedas.map((m) => (
												<option key={m.value} value={m.value}>{m.label}</option>
											))}
										</select>
									</div>
									<div className="flex-1">
										<label className="block text-gray-300 font-semibold mb-1">Zona Horaria</label>
										<select
											name="zonaHoraria"
											value={form.zonaHoraria}
											onChange={handleInput}
											className="w-full px-3 py-2 rounded bg-[#232936] border border-[#2c3240] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											{zonasHorarias.map((z) => (
												<option key={z} value={z}>{z}</option>
											))}
										</select>
									</div>
								</div>
								{/* Toggles */}
								<div className="flex gap-6">
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											name="notificaciones"
											checked={form.notificaciones}
											onChange={handleInput}
											className="accent-green-500 w-5 h-5"
											id="notificaciones"
										/>
										<label htmlFor="notificaciones" className="text-gray-300">Notificaciones activas</label>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											name="modoOscuro"
											checked={form.modoOscuro}
											onChange={handleInput}
											className="accent-blue-500 w-5 h-5"
											id="modoOscuro"
										/>
										<label htmlFor="modoOscuro" className="text-gray-300">Modo oscuro</label>
									</div>
								</div>
								{/* Botones */}
								<div className="flex gap-4 mt-2">
									<button
										type="submit"
										className={`flex-1 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition-colors flex items-center justify-center gap-2 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
										disabled={saving}
									>
										{saving ? (
											<span className="animate-pulse">Guardando...</span>
										) : (
											<>
												<FaCheckCircle /> Guardar Cambios
											</>
										)}
									</button>
									<button
										type="button"
										className="flex-1 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow transition-colors"
										onClick={() => setForm(initialForm)}
										disabled={saving}
									>
										Cancelar
									</button>
								</div>
							</form>
						)}
					</section>
				)}

				{/* Otras categorías: solo placeholder visual */}
				{activeCategory !== 'general' && (
					<section className="mb-8">
						<div
							className="flex items-center justify-between cursor-pointer mb-2"
							onClick={() => handleSectionToggle(activeCategory)}
						>
							<h2 className="text-2xl font-bold text-white">{SIDEBAR_CATEGORIES.find((c) => c.key === activeCategory)?.label}</h2>
							{expandedSections[activeCategory] ? (
								<FaChevronUp className="text-blue-400" />
							) : (
								<FaChevronDown className="text-blue-400" />
							)}
						</div>
						{expandedSections[activeCategory] && (
							<div className="bg-[#232936] rounded-lg shadow-lg p-6 border border-[#2c3240] text-gray-400">
								<p className="italic">Próximamente: configuración de {SIDEBAR_CATEGORIES.find((c) => c.key === activeCategory)?.label}.</p>
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	);
};

export default Settings;
