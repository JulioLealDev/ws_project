import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"

export const Home = () => {

  const { loading, error, result } = useReadCypher(`
    MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) 
    WITH s, COUNT(r) AS num ORDER BY num DESC 
    RETURN s LIMIT 24
  `);
    
    
    return (
      <BasicLayout loading={loading} error={error}>
        TESTEEEE
      </BasicLayout>
    )
}