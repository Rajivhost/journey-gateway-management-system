import { JourneyGateway, CountryCode, JourneyGatewayStatus, JourneyGatewayType } from '../types';

export const mockCarriers = [
  {
    carrierId: 'carr-1',
    code: 'MTN',
    name: 'MTN',
    country: CountryCode.CM,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    carrierId: 'carr-2',
    code: 'ORANGE',
    name: 'Orange',
    country: CountryCode.CM,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    carrierId: 'carr-3',
    code: 'AIRTEL',
    name: 'Airtel',
    country: CountryCode.SN,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    carrierId: 'carr-4',
    code: 'MOOV',
    name: 'Moov',
    country: CountryCode.CI,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export const mockGateways: JourneyGateway[] = [
  {
    gatewayId: 'gw-1',
    name: 'CM MTN USSD Gateway',
    status: JourneyGatewayStatus.ACTIVE,
    carrier: mockCarriers[0],
    country: CountryCode.CM,
    shortCode: '*123#',
    gatewayType: JourneyGatewayType.MULTI_PROVIDER,
    description: 'Primary USSD gateway for MTN Cameroon',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-06-20T15:45:00Z'
  },
  {
    gatewayId: 'gw-2',
    name: 'CM Orange USSD Gateway',
    status: JourneyGatewayStatus.ACTIVE,
    carrier: mockCarriers[1],
    country: CountryCode.CM,
    shortCode: '*456#',
    gatewayType: JourneyGatewayType.SINGLE_PROVIDER,
    description: 'Primary USSD gateway for Orange Cameroon',
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-06-18T09:30:00Z'
  },
  {
    gatewayId: 'gw-3',
    name: 'SN Airtel Gateway',
    status: JourneyGatewayStatus.MAINTENANCE,
    carrier: mockCarriers[2],
    country: CountryCode.SN,
    shortCode: '*789#',
    gatewayType: JourneyGatewayType.MULTI_PROVIDER,
    description: 'USSD gateway for Airtel Senegal',
    createdAt: '2024-02-05T14:20:00Z',
    updatedAt: '2024-06-21T16:10:00Z'
  },
  {
    gatewayId: 'gw-4',
    name: 'CI Moov Gateway',
    status: JourneyGatewayStatus.INACTIVE,
    carrier: mockCarriers[3],
    country: CountryCode.CI,
    shortCode: '*321#',
    gatewayType: JourneyGatewayType.SINGLE_PROVIDER,
    description: 'USSD gateway for Moov Ivory Coast',
    createdAt: '2024-02-10T09:45:00Z',
    updatedAt: '2024-05-30T11:20:00Z'
  },
  {
    gatewayId: 'gw-5',
    name: 'CM MTN SMS Gateway',
    status: JourneyGatewayStatus.ACTIVE,
    carrier: mockCarriers[0],
    country: CountryCode.CM,
    shortCode: '8080',
    gatewayType: JourneyGatewayType.MULTI_PROVIDER,
    description: 'SMS gateway for MTN Cameroon',
    createdAt: '2024-03-01T13:10:00Z',
    updatedAt: '2024-06-15T10:25:00Z'
  },
  {
    gatewayId: 'gw-6',
    name: 'SN Airtel SMS Gateway',
    status: JourneyGatewayStatus.ACTIVE,
    carrier: mockCarriers[2],
    country: CountryCode.SN,
    shortCode: '7070',
    gatewayType: JourneyGatewayType.SINGLE_PROVIDER,
    description: 'SMS gateway for Airtel Senegal',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-06-10T14:40:00Z'
  }
];

export const mockCategories = [
  {
    categoryId: 'cat-1',
    name: 'Banking Services',
    country: CountryCode.CM,
    description: 'Financial and banking related services',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    categoryId: 'cat-2',
    name: 'Health Services',
    country: CountryCode.CM,
    description: 'Medical and health related services',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  },
  {
    categoryId: 'cat-3',
    name: 'Education',
    country: CountryCode.SN,
    description: 'Educational services and information',
    createdAt: '2024-01-11T10:20:00Z',
    updatedAt: '2024-01-11T10:20:00Z'
  }
];

export const mockGatewayMenus = [
  {
    menuId: 'menu-1',
    gateway: mockGateways[0],
    category: mockCategories[0],
    active: true,
    country: CountryCode.CM,
    position: 1,
    menuText: 'Banking & Finance',
    description: 'Access banking and financial services',
    createdAt: '2024-01-16T11:30:00Z',
    updatedAt: '2024-06-10T09:45:00Z'
  },
  {
    menuId: 'menu-2',
    gateway: mockGateways[0],
    category: mockCategories[1],
    active: true,
    country: CountryCode.CM,
    position: 2,
    menuText: 'Health Services',
    description: 'Access health related services',
    createdAt: '2024-01-16T11:35:00Z',
    updatedAt: '2024-06-12T14:20:00Z'
  },
  {
    menuId: 'menu-3',
    gateway: mockGateways[2],
    category: mockCategories[2],
    active: true,
    country: CountryCode.SN,
    position: 1,
    menuText: 'Education',
    description: 'Educational services menu',
    createdAt: '2024-02-06T09:40:00Z',
    updatedAt: '2024-05-20T11:15:00Z'
  }
];