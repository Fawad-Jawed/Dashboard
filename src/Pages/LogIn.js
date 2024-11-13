import React, { useState } from 'react';
import { Form, Button } from 'antd';
import CustomAlert from '../Componenets/CustomAlert';
import CustomInput from '../Componenets/CustomInput';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase/FirebaseConfig';
import BackButton from '../Componenets/BackButton';
import { useNavigate,Link } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setSuccess("Account logged in successfully!");
      form.resetFields();

      setTimeout(() => {
        navigate('/Dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Back Button Component */}
        <BackButton />

        {/* Header */}
        <h2 className="text-3xl font-semibold text-center text-indigo-900 mb-6">Login</h2>

        {/* Error Alert */}
        {error && (
          <CustomAlert 
            message={error} 
            type="error" 
            closable 
            onClose={() => setError(null)} 
            className="mb-4"
          />
        )}

        {/* Success Alert */}
        {success && (
          <CustomAlert 
            message={success} 
            type="success" 
            closable 
            onClose={() => setSuccess(null)} 
            className="mb-4"
          />
        )}

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Email Field */}
          <Form.Item 
            name="email" 
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <CustomInput 
              placeholder="Email" 
              type="email" 
              icon={<UserOutlined />} 
              onChange={(e) => form.setFieldsValue({ email: e.target.value })} 
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <CustomInput 
              placeholder="Password" 
              type="password" 
              icon={<LockOutlined />} 
              onChange={(e) => form.setFieldsValue({ password: e.target.value })} 
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
          Don't have an account? {' '}
            <Link to="/signup" className="text-indigo-600 font-semibold">SignUp here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
