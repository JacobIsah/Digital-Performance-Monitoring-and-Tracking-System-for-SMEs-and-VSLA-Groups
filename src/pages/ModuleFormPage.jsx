import { useParams, Navigate } from 'react-router-dom';
import { SCHEMA_BY_KEY } from '../schemas';
import ModuleForm from '../components/ModuleForm';

export default function ModuleFormPage() {
  const { moduleKey } = useParams();
  const schema = SCHEMA_BY_KEY[moduleKey];
  if (!schema) return <Navigate to="/" replace />;
  return <ModuleForm schema={schema} key={moduleKey} />;
}
