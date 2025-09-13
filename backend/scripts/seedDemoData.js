import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import FarmerKYC from '../models/FarmerKYC.js';
import NGOKYC from '../models/NGOKYC.js';

dotenv.config();

const seedDemoData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmvilla');
    console.log('Connected to MongoDB');

    // Clear existing data
    await FarmerKYC.deleteMany({});
    await NGOKYC.deleteMany({});
    console.log('Cleared existing KYC data');

    // Hash password for demo accounts
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Demo Farmers
    const demoFarmers = [
      {
        personalInfo: {
          fullName: 'Raman Kumar',
          phone: '9876543210',
          email: 'raman@farmer.com',
          address: 'Village Kummakonam, Kottayam District',
          pincode: '686001',
          state: 'Kerala',
          district: 'Kottayam'
        },
        farmInfo: {
          farmSize: '2.5 acres',
          cropTypes: 'Rice, Coconut, Spices',
          farmLocation: 'Kummakonam Village, Near Meenachil River',
          experience: '10+'
        },
        documents: {
          aadhar: { uploaded: true, filename: 'aadhar_raman.pdf' },
          landRecords: { uploaded: true, filename: 'land_raman.pdf' }
        },
        status: 'approved',
        verificationDetails: {
          submittedAt: new Date('2024-01-15'),
          reviewedAt: new Date('2024-01-17'),
          reviewedBy: 'Admin',
          approvalNotes: 'All documents verified successfully'
        },
        loginCredentials: {
          isActive: true,
          password: hashedPassword
        }
      },
      {
        personalInfo: {
          fullName: 'Lakshmi Nair',
          phone: '9876543211',
          email: 'lakshmi@farmer.com',
          address: 'Thrissur Town, Near Vadakkunnathan Temple',
          pincode: '680001',
          state: 'Kerala',
          district: 'Thrissur'
        },
        farmInfo: {
          farmSize: '1.8 acres',
          cropTypes: 'Vegetables, Banana, Pepper',
          farmLocation: 'Thrissur Rural, Chalakudy Road',
          experience: '6-10'
        },
        documents: {
          aadhar: { uploaded: true, filename: 'aadhar_lakshmi.pdf' },
          landRecords: { uploaded: true, filename: 'land_lakshmi.pdf' }
        },
        status: 'approved',
        verificationDetails: {
          submittedAt: new Date('2024-01-20'),
          reviewedAt: new Date('2024-01-22'),
          reviewedBy: 'Admin',
          approvalNotes: 'Verified organic farming practices'
        },
        loginCredentials: {
          isActive: true,
          password: hashedPassword
        }
      },
      {
        personalInfo: {
          fullName: 'Priya Menon',
          phone: '9876543212',
          email: 'priya@farmer.com',
          address: 'Kozhikode Beach Road, Calicut',
          pincode: '673001',
          state: 'Kerala',
          district: 'Kozhikode'
        },
        farmInfo: {
          farmSize: '3.2 acres',
          cropTypes: 'Cashew, Coconut, Tapioca',
          farmLocation: 'Kozhikode Rural, Malabar Coast',
          experience: '3-5'
        },
        documents: {
          aadhar: { uploaded: true, filename: 'aadhar_priya.pdf' },
          landRecords: { uploaded: true, filename: 'land_priya.pdf' }
        },
        status: 'approved',
        verificationDetails: {
          submittedAt: new Date('2024-02-01'),
          reviewedAt: new Date('2024-02-03'),
          reviewedBy: 'Admin',
          approvalNotes: 'Coastal farming expertise verified'
        },
        loginCredentials: {
          isActive: true,
          password: hashedPassword
        }
      }
    ];

    // Demo NGOs
    const demoNGOs = [
      {
        organizationInfo: {
          ngoName: 'Kerala Farmers Welfare Trust',
          registrationNumber: 'KL/TR/2020/001',
          establishedYear: '2020',
          phone: '9876543220',
          email: 'info@kfwt.org',
          website: 'https://kfwt.org',
          address: 'MG Road, Ernakulam, Kochi',
          pincode: '682001',
          state: 'Kerala',
          district: 'Ernakulam'
        },
        focusAreas: {
          primaryFocus: 'Agriculture & Farming',
          targetBeneficiaries: 'Small and marginal farmers in Kerala',
          geographicalArea: 'Ernakulam, Kottayam, Thrissur districts',
          experience: '3-5',
          currentProjects: 'Organic farming promotion, Water conservation, Farmer training programs'
        },
        legalInfo: {
          registrationType: 'Trust',
          fcraNumber: 'FCRA/KL/2021/001',
          panNumber: 'AABCK1234F',
          gstNumber: '32AABCK1234F1Z5',
          trusteeDetails: 'Dr. Suresh Kumar (Chairman), Ms. Meera Nair (Secretary), Mr. Rajesh Pillai (Treasurer)'
        },
        documents: {
          registrationCertificate: { uploaded: true, filename: 'reg_kfwt.pdf' },
          panCard: { uploaded: true, filename: 'pan_kfwt.pdf' },
          auditedFinancials: { uploaded: true, filename: 'audit_kfwt.pdf' },
          trustDeed: { uploaded: true, filename: 'deed_kfwt.pdf' }
        },
        status: 'approved',
        verificationDetails: {
          submittedAt: new Date('2024-01-10'),
          reviewedAt: new Date('2024-01-15'),
          reviewedBy: 'Admin',
          approvalNotes: 'Excellent track record in agricultural development'
        },
        loginCredentials: {
          isActive: true,
          password: hashedPassword
        }
      },
      {
        organizationInfo: {
          ngoName: 'Sustainable Agriculture Foundation',
          registrationNumber: 'KL/SOC/2019/045',
          establishedYear: '2019',
          phone: '9876543221',
          email: 'contact@safoundation.org',
          website: 'https://safoundation.org',
          address: 'Palakkad Junction, Near Railway Station',
          pincode: '678001',
          state: 'Kerala',
          district: 'Palakkad'
        },
        focusAreas: {
          primaryFocus: 'Environment & Sustainability',
          targetBeneficiaries: 'Farmers, Rural communities, Youth',
          geographicalArea: 'Palakkad, Malappuram, Wayanad districts',
          experience: '6-10',
          currentProjects: 'Climate-smart agriculture, Renewable energy for farms, Biodiversity conservation'
        },
        legalInfo: {
          registrationType: 'Society',
          fcraNumber: 'FCRA/KL/2020/078',
          panNumber: 'AABCS5678G',
          gstNumber: '32AABCS5678G1Z8',
          trusteeDetails: 'Prof. Anitha Kumari (President), Mr. Vineeth Kumar (Vice President), Dr. Radhika Nair (Secretary)'
        },
        documents: {
          registrationCertificate: { uploaded: true, filename: 'reg_saf.pdf' },
          panCard: { uploaded: true, filename: 'pan_saf.pdf' },
          auditedFinancials: { uploaded: true, filename: 'audit_saf.pdf' },
          trustDeed: { uploaded: true, filename: 'deed_saf.pdf' }
        },
        status: 'approved',
        verificationDetails: {
          submittedAt: new Date('2024-01-25'),
          reviewedAt: new Date('2024-01-28'),
          reviewedBy: 'Admin',
          approvalNotes: 'Strong focus on sustainable practices and environmental conservation'
        },
        loginCredentials: {
          isActive: true,
          password: hashedPassword
        }
      }
    ];

    // Insert demo farmers
    await FarmerKYC.insertMany(demoFarmers);
    console.log(`✅ Inserted ${demoFarmers.length} demo farmers`);

    // Insert demo NGOs
    await NGOKYC.insertMany(demoNGOs);
    console.log(`✅ Inserted ${demoNGOs.length} demo NGOs`);

    console.log('\n🎉 Demo data seeded successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('\n👨‍🌾 FARMERS:');
    console.log('Phone: 9876543210 | Email: raman@farmer.com | Password: demo123');
    console.log('Phone: 9876543211 | Email: lakshmi@farmer.com | Password: demo123');
    console.log('Phone: 9876543212 | Email: priya@farmer.com | Password: demo123');
    console.log('\n🏢 NGOs:');
    console.log('Phone: 9876543220 | Email: info@kfwt.org | Password: demo123');
    console.log('Phone: 9876543221 | Email: contact@safoundation.org | Password: demo123');

    process.exit(0);

  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
