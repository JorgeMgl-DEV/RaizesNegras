class Usuario:
    def __init__(self, nome, nivel_permissao):
        self.nome = nome
        self.nivel_permissao = nivel_permissao

class Aplicacao:
    def __init__(self):
        self.usuarios = []

    def adicionar_usuario(self, usuario):
        self.usuarios.append(usuario)

    def verificar_permissao(self, nome_usuario):
        for usuario in self.usuarios:
            if usuario.nome == nome_usuario:
                if usuario.nivel_permissao >= 1:
                    self.exibir_menu()
                else:
                    print(f"Usuário {nome_usuario} não tem permissão para acessar a aplicação.")
                return
        print(f"Usuário {nome_usuario} não encontrado.")

    def exibir_menu(self):
        print("Menu da Aplicação:")
        print("1. Opção 1")
        print("2. Opção 2")
        print("3. Sair")
        opcao = input("Escolha uma opção: ")
        if opcao == "1":
            print("Você escolheu a Opção 1.")
        elif opcao == "2":
            print("Você escolheu a Opção 2.")
        elif opcao == "3":
            print("Saindo...")
        else:
            print("Opção inválida.")

# Exemplo de uso
app = Aplicacao()
usuario1 = Usuario("Jorge", 2)
usuario2 = Usuario("Maria", 0)

app.adicionar_usuario(usuario1)
app.adicionar_usuario(usuario2)

while True:
    nome_usuario = input("Digite seu nome de usuário (ou 'sair' para encerrar): ")
    if nome_usuario.lower() == 'sair':
        break
    app.verificar_permissao(nome_usuario)