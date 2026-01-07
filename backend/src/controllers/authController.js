import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import config from '../config/index.js';

const generateToken = (userId) => jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, role: true },
    });
    res.status(201).json({ message: 'Registration successful', user, token: generateToken(user.id) });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name, role: user.role }, token: generateToken(user.id) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true, role: true, createdAt: true,
        subscriptions: { where: { status: 'active', endDate: { gte: new Date() } }, include: { plan: { include: { season: true } } } },
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: updateData, select: { id: true, email: true, name: true, role: true } });
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, subscriptions: { where: { status: 'active' }, include: { plan: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'vip', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await prisma.user.update({ where: { id: userId }, data: { role }, select: { id: true, email: true, name: true, role: true } });
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.userId } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
