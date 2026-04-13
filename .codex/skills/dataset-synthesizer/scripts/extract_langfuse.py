import os
import json
from langfuse import Langfuse

def extract_traces(output_file="langfuse_raw.jsonl", limit=1000):
    """
    Extrai traces do Langfuse e aplica um filtro básico antes de passar para a IA.
    Certifique-se de configurar as variáveis de ambiente:
    LANGFUSE_SECRET_KEY, LANGFUSE_PUBLIC_KEY, LANGFUSE_HOST
    """
    print("Conectando ao Langfuse...")
    # Inicializa o cliente Langfuse iterando com as variáveis de ambiente
    langfuse = Langfuse()

    print(f"Extraindo até {limit} traces do Langfuse...")
    
    # Busca as gerações/traces pertinentes (ajuste os filtros conforme precisar)
    # A API v2 do python client fornece métodos para buscar traces usando `get_traces`
    traces = langfuse.get_traces(
        limit=limit
        # tags=["production"] # Exemplo de filtro caso você utilize tags
    )
    
    valid_count = 0
    with open(output_file, 'w', encoding='utf-8') as f:
        for trace in traces.data:
            # Filtro básico de qualidade de dados: ignora traces sem input
            if not trace.input or not trace.output:
                continue
                
            input_str = str(trace.input)
            output_str = str(trace.output)
            
            # Aplica primeiro filtro da Skill (Erros internos do agente)
            if "Input to ChatPromptTemplate is missing variables" in output_str or \
               "Agent stopped due to a validation error" in output_str:
                continue
                
            # Salva o trace bruto filtrado
            log_entry = {
                "trace_id": trace.id,
                "session_id": trace.session_id,
                "input": trace.input,
                "output": trace.output,
                "metadata": trace.metadata
            }
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
            valid_count += 1
            
    print(f"Extração concluída! {valid_count} logs válidos salvos em '{output_file}'.")
    print("Agora você pode processar este arquivo usando a skill 'dataset-synthesizer' para gerar os exemplos de treino no formato de Fine-Tuning.")

if __name__ == "__main__":
    extract_traces()
