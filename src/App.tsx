import { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl, MapRef, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowLeft, ChevronDown, Crosshair, Info, Map as MapIcon, Globe, Moon, AlertTriangle, X } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const [showSummary, setShowSummary] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState<'dark' | 'street' | 'satellite'>('dark');
  const mapRef = useRef<MapRef>(null);

  const getMapboxStyle = () => {
    switch (mapStyle) {
      case 'street': return 'mapbox://styles/mapbox/streets-v12';
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'dark': default: return 'mapbox://styles/mapbox/dark-v11';
    }
  };

  const handleMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]); // mapbox uses [lng, lat]

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 16,
              pitch: 60, // Inclinação severa para ver prédios 3D
              bearing: 20, // Suave rotação para a câmera não chegar seca
              duration: 2500 // Animação de 2.5 segundos de voo cinemático
            });
          }
        },
        (error) => {
          console.error("Erro ao obter localização", error);
          alert("GPS inacessível ou negado.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocalização não é suportada neste navegador.');
    }
  }, []);

  useEffect(() => {
    handleMyLocation();
  }, [handleMyLocation]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-white overflow-hidden relative font-sans">
      {/* Header Title */}
      <div className="absolute top-0 left-0 right-0 h-24 pt-8 flex items-start justify-center px-20 z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-white text-lg sm:text-lg font-bold drop-shadow-md truncate text-center">Mapa de Segurança</h1>
      </div>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md hover:bg-slate-800 border border-slate-700 pointer-events-auto transition-colors focus:outline-none"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      {/* Map Style Toggle */}
      <div className="absolute top-6 right-4 z-30 flex bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 p-1 pointer-events-auto shadow-lg">
        <button
          onClick={() => setMapStyle('dark')}
          className={`p-2 rounded-full transition-colors ${mapStyle === 'dark' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          title="Modo Escuro (Alerta)"
        >
          <Moon size={18} />
        </button>
        <button
          onClick={() => setMapStyle('street')}
          className={`p-2 rounded-full transition-colors ${mapStyle === 'street' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          title="Ruas (Claro)"
        >
          <MapIcon size={18} />
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          className={`p-2 rounded-full transition-colors ${mapStyle === 'satellite' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          title="Visão Satélite Real"
        >
          <Globe size={18} />
        </button>
      </div>

      {/* Container do Mapa (Mapbox) */}
      <div className="flex-1 w-full h-full relative z-0 bg-slate-900">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: -51.9253, // Centro do Brasil 
            latitude: -14.2350,
            zoom: 3.5, // Começa bem de longe
            pitch: 0
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={getMapboxStyle()}
          attributionControl={false}
          logoPosition="bottom-left"
        >
          {/* Controles de Rotação (Aparecem em Telas Grandes, em Celular se Roda com Dedo) */}
          <NavigationControl position="top-right" style={{ marginTop: 90, marginRight: 20 }} showCompass={true} showZoom={true} />

          {/* User Location Marker Customizado (Radar Azul) */}
          {userLocation && (
            <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute w-6 h-6 bg-blue-500 rounded-full opacity-40"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
              </div>
            </Marker>
          )}

          {/* Renderização Real de Prédios em 3D */}
          {mapStyle !== 'satellite' && (
            <Layer
              id="3d-buildings"
              source="composite"
              source-layer="building"
              filter={['==', 'extrude', 'true']}
              type="fill-extrusion"
              minzoom={14}
              paint={{
                'fill-extrusion-color': mapStyle === 'dark' ? '#334155' : '#e2e8f0',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': mapStyle === 'dark' ? 0.6 : 0.8
              }}
            />
          )}
        </Map>
      </div>

      {/* Bottom Summary UI */}
      {showSummary ? (
        <div className="absolute bottom-[90px] left-4 right-4 z-40 pointer-events-none">
          <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-xl pointer-events-auto mx-auto max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-white font-bold text-xl">Resumo da Área</h2>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Monitoramento Ativo</p>
              </div>
              <button
                onClick={() => setShowSummary(false)}
                className="bg-slate-800 p-1.5 rounded-full border border-slate-700 hover:bg-slate-700 focus:outline-none transition-colors"
              >
                <ChevronDown size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex gap-4 mt-2">
              <div className="flex flex-col items-center justify-center flex-1 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <span className="text-white font-black text-2xl leading-none">0</span>
                <span className="text-slate-400 text-[10px] uppercase font-semibold mt-1">Incidentes</span>
              </div>
              <button
                onClick={handleMyLocation}
                className="flex flex-col items-center justify-center flex-1 bg-blue-600 p-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 border border-blue-400 focus:outline-none transition-all active:scale-95"
              >
                <Crosshair size={24} className="text-white mb-1" />
                <span className="text-white font-bold text-[10px] uppercase text-center leading-tight">Voo 3D<br />(Localizar)</span>
              </button>
            </div>

            {/* Red Alert Button - Main Panel */}
            <button
              onClick={() => setIsReporting(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 p-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 border border-red-400 focus:outline-none transition-all active:scale-95"
            >
              <AlertTriangle size={20} className="text-white" />
              <span className="text-white font-bold uppercase tracking-wide">Reportar Incidente</span>
            </button>
          </div>
        </div>
      ) : (
        /* Floating Action Buttons when summary is collapsed */
        <div className="absolute bottom-[100px] right-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => setIsReporting(true)}
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400 hover:bg-red-500 transition-all active:scale-95 focus:outline-none"
          >
            <AlertTriangle size={22} className="text-white" />
          </button>
          <button
            onClick={handleMyLocation}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400 hover:bg-blue-500 transition-all active:scale-95 focus:outline-none"
          >
            <Crosshair size={22} className="text-white" />
          </button>
          <button
            onClick={() => setShowSummary(true)}
            className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-600 hover:bg-slate-700 transition-all active:scale-95 focus:outline-none"
          >
            <Info size={22} className="text-blue-400" />
          </button>
        </div>
      )}

      {/* Report Incident Modal Slide Up */}
      {isReporting && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-2xl flex items-center gap-2">
                <AlertTriangle className="text-red-500 fill-red-500/20" size={28} />
                Novo Alerta
              </h2>
              <button
                onClick={() => setIsReporting(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-5 leading-relaxed">
              Posicione no mapa de fundo o local exato. Selecione a categoria abaixo para alertar os outros usuários instantaneamente:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-red-500 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50">
                <span className="text-3xl mb-2 drop-shadow-md">🔫</span>
                <span className="text-white font-semibold text-xs text-center uppercase tracking-wide">Assalto<br /><span className="text-slate-400 text-[10px] capitalize">(Armado)</span></span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                <span className="text-3xl mb-2 drop-shadow-md">🏃</span>
                <span className="text-white font-semibold text-xs text-center uppercase tracking-wide">Furto<br /><span className="text-slate-400 text-[10px] capitalize">(Sem Arma)</span></span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-yellow-500 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
                <span className="text-3xl mb-2 drop-shadow-md">👀</span>
                <span className="text-white font-semibold text-xs text-center uppercase tracking-wide">Atividade<br /><span className="text-slate-400 text-[10px] capitalize">Suspeita</span></span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <span className="text-3xl mb-2 drop-shadow-md">🚗</span>
                <span className="text-white font-semibold text-xs text-center uppercase tracking-wide">Veículo<br /><span className="text-slate-400 text-[10px] capitalize">Roubado</span></span>
              </button>
            </div>

            <button
              className="w-full bg-red-600 text-white font-bold uppercase tracking-wider p-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-500 transition-all mb-3 focus:outline-none"
              onClick={() => {
                alert("Supabase vai salvar agora esse tipo no mapa!");
                setIsReporting(false);
              }}
            >
              Publicar Alerta
            </button>
            <p className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Use com responsabilidade. Falsos alertas são crime.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
