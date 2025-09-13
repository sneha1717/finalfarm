const API_BASE_URL = 'http://localhost:5001/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  organizationName: string;
  email: string;
  mobile: string;
  password: string;
  ngoRegistrationId: string;
  details: string;
  focusAreas: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  socialMedia?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  photo?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('ngoToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(loginData: LoginData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (data.success && data.data.token) {
        localStorage.setItem('ngoToken', data.data.token);
        localStorage.setItem('ngoUser', JSON.stringify(data.data.ngo));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the backend server is running.',
      };
    }
  }

  async register(registerData: RegisterData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      
      if (data.success && data.data.token) {
        localStorage.setItem('ngoToken', data.data.token);
        localStorage.setItem('ngoUser', JSON.stringify(data.data.ngo));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the backend server is running.',
      };
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (data.success && data.data.ngo) {
        localStorage.setItem('ngoUser', JSON.stringify(data.data.ngo));
      }
      
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the backend server is running.',
      };
    }
  }

  async updateProfile(profileData: Partial<RegisterData>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (data.success && data.data.ngo) {
        localStorage.setItem('ngoUser', JSON.stringify(data.data.ngo));
      }
      
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the backend server is running.',
      };
    }
  }

  logout() {
    localStorage.removeItem('ngoToken');
    localStorage.removeItem('ngoUser');
    localStorage.removeItem('userType');
  }
}

export const apiService = new ApiService();
export type { LoginData, RegisterData, ApiResponse };
