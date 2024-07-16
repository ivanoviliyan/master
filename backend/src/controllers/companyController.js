const Company = require('../models/companyModel');
const bcrypt = require('bcryptjs');

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        if (companies.length > 0) {
            return res.status(200).json({ data: companies, message: "Companies retrieved successfully!" });
        }

        return res.status(404).json({ message: "No existing companies!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving companies!" });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const id = req.params.id;
        const company = await Company.findById(id);

        if (company) {
            return res.status(200).json({ data: company, message: "Company retrieved successfully!" });
        }

        return res.status(404).json({ message: "Company does not exist!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving company!" });
    }
};

const createCompany = async (req, res) => {
    try {
        const company = req.body;
        const salt = await bcrypt.genSalt(10);

        company.password = await bcrypt.hash(company.password, salt);
        const document = await Company.create(company);

        return res.status(201).json({ data: document, message: 'Company created successfully!' });
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({ message: "Error creating company!" });
    }
};

const updateCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const company = req.body;
        const updatedCompany = await Company.findByIdAndUpdate(id, company, { new: true });

        if (updatedCompany) {
            return res.status(200).json({ data: updatedCompany, message: "Company updated successfully!" });
        }

        return res.status(404).json({ message: `Company with ID ${id} does not exist!` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating company!" });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const exists = await Company.findById(id);

        if (exists) {
            await Company.deleteOne({ _id: id });
            return res.status(200).json({ message: "Company deleted successfully!" });
        }

        return res.status(404).json({ message: "The provided ID does not exist!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting company!" });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
};