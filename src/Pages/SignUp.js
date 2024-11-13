import React, { useState } from 'react';
import { Form, Button, Select, DatePicker } from 'antd';
import CustomAlert from '../Componenets/CustomAlert';
import CustomInput from '../Componenets/CustomInput';
import BackButton from '../Componenets/BackButton';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SignUp = () => {
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
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Add the user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,  // Use the same uid as Firebase Authentication
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        dob: values.dob.format('YYYY-MM-DD'),
        linkedin: values.linkedin,
        github: values.github,
      });

      setSuccess("Account created successfully!");
      form.resetFields();

      setTimeout(() => {
        navigate('/LogIn'); // Navigate to login page after successful sign-up
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl sm:max-w-2xl">
        <BackButton />
        <h2 className="text-3xl font-semibold text-center text-indigo-900 mb-6">Sign Up</h2>

        {/* Show Success or Error Alerts */}
        {error && <CustomAlert message={error} type="error" />}
        {success && <CustomAlert message={success} type="success" />}

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Form Fields in Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}>
              <CustomInput placeholder="First Name" icon={<UserOutlined />} />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}>
              <CustomInput placeholder="Last Name" icon={<UserOutlined />} />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}>
              <CustomInput placeholder="Email" type="email" icon={<MailOutlined />} />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}>
              <CustomInput placeholder="Password" type="password" icon={<LockOutlined />} />
            </Form.Item>

            {/* Gender Select */}
            <Form.Item
              name="gender"
              rules={[{ required: true, message: 'Please select your gender' }]}>
              <Select placeholder="Gender">
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>

            {/* Date of Birth */}
            <Form.Item
              name="dob"
              rules={[{ required: true, message: 'Please select your date of birth' }]}>
              <DatePicker placeholder="Date of Birth" className="w-full" />
            </Form.Item>

            {/* LinkedIn */}
            <Form.Item
              name="linkedin"
              rules={[{ required: true, message: 'Please enter your LinkedIn ID' }]}>
              <CustomInput placeholder="LinkedIn ID" icon={<LinkedinOutlined />} />
            </Form.Item>

            {/* GitHub */}
            <Form.Item
              name="github"
              rules={[{ required: true, message: 'Please enter your GitHub link' }]}>
              <CustomInput placeholder="GitHub Link" icon={<GithubOutlined />} />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold">LogIn here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
