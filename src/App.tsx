import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CountryCode } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { GatewayListPage } from './pages/GatewayList';
import { GatewayDetailPage } from './pages/GatewayDetail';
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';
import { RegistrationRequestsPage } from './pages/providers/RegistrationRequests';
import { ProviderRequestDetailPage } from './pages/providers/ProviderRequestDetail';
import { ServiceProviderListPage } from './pages/providers/ServiceProviderList';
import { ServiceProviderDetailPage } from './pages/providers/ServiceProviderDetail';
import { CarrierListPage } from './pages/carriers/CarrierList';
import { CategoryListPage } from './pages/categories/CategoryList';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProductListPage } from './pages/products/ProductListPage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { CreateProductPage } from './pages/products/CreateProductPage';
import { EditProductPage } from './pages/products/EditProductPage';
import { JourneyListPage } from './pages/journeys/JourneyListPage';
import { JourneyDetailPage } from './pages/journeys/JourneyDetailPage';
import { SessionListPage } from './pages/sessions/SessionListPage';
import { SessionDetailPage } from './pages/sessions/SessionDetailPage';
import { GatewayRegistrationDetailPage } from './pages/gateways/GatewayRegistrationDetailPage';
import { SimulatorPage } from './pages/simulator/SimulatorPage';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(CountryCode.CM);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route
          path="/*"
          element={
            <div className="flex h-screen bg-gray-100">
              <Sidebar isExpanded={isSidebarExpanded} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                  selectedCountry={selectedCountry} 
                  onCountryChange={handleCountryChange}
                  onToggleSidebar={toggleSidebar}
                  isSidebarExpanded={isSidebarExpanded}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard selectedCountry={selectedCountry} />} />
                    <Route path="/gateways" element={<GatewayListPage selectedCountry={selectedCountry} />} />
                    <Route path="/gateways/:id" element={<GatewayDetailPage selectedCountry={selectedCountry} />} />
                    <Route path="/gateways/registrations/:id" element={<GatewayRegistrationDetailPage />} />
                    <Route path="/carriers" element={<CarrierListPage selectedCountry={selectedCountry} />} />
                    <Route path="/categories" element={<CategoryListPage selectedCountry={selectedCountry} />} />
                    <Route path="/providers" element={<ServiceProviderListPage selectedCountry={selectedCountry} />} />
                    <Route path="/providers/:id" element={<ServiceProviderDetailPage />} />
                    <Route path="/providers/requests" element={<RegistrationRequestsPage selectedCountry={selectedCountry} />} />
                    <Route path="/providers/requests/:id" element={<ProviderRequestDetailPage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/new" element={<CreateProductPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/products/:id/edit" element={<EditProductPage />} />
                    <Route path="/journeys" element={<JourneyListPage selectedCountry={selectedCountry} />} />
                    <Route path="/journeys/:id" element={<JourneyDetailPage />} />
                    <Route path="/sessions" element={<SessionListPage selectedCountry={selectedCountry} />} />
                    <Route path="/sessions/:id" element={<SessionDetailPage />} />
                    <Route path="/settings/*" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;