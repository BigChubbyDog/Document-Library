// Jest setup file for environment configuration and mocks

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Mock Azure Key Vault for tests
jest.mock('./src/utils/azure-key-vault-client', () => {
    return {
        getSecret: jest.fn().mockResolvedValue('mock-secret-value'),
        setSecret: jest.fn().mockResolvedValue(true),
        initialize: jest.fn().mockResolvedValue(true)
    };
});

// Mock Teams webhook calls
global.fetch = jest.fn();

// Global test utilities
global.testUtils = {
    mockTeamsResponse: () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: true })
        });
    },
    
    createMockLead: () => ({
        id: 'test_lead_123',
        email: 'test@example.com',
        phone: '555-0123',
        first_name: 'John',
        last_name: 'Doe',
        platform: 'facebook'
    })
};

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});