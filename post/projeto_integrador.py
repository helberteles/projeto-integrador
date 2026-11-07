"""
Projeto Integrador - Fase 2
Demonstração estática em Python (Tkinter)

Esta aplicação apresenta três telas:
1. Produtos
2. Fornecedores
3. Associação Produto/Fornecedor

Observação:
Este é um protótipo visual local. Ele não implementa serviços REST,
não utiliza banco de dados e não fica disponível na nuvem.
"""

import tkinter as tk
from tkinter import ttk, messagebox


class ProjetoIntegradorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Projeto Integrador | Gestão de Produtos e Fornecedores")
        self.geometry("1050x680")
        self.minsize(900, 580)
        self.configure(bg="#f3f6fb")

        self.produtos = [
            ("P001", "Notebook Lenovo", "Computador portátil", "R$ 3.499,90", "789000000001"),
            ("P002", "Mouse sem fio", "Mouse óptico USB", "R$ 89,90", "789000000002"),
            ("P003", "Teclado USB", "Teclado ABNT2", "R$ 129,90", "789000000003"),
        ]
        self.fornecedores = [
            ("F001", "Tech Distribuidora Ltda.", "12.345.678/0001-90", "São Paulo - SP", "(11) 3333-1000"),
            ("F002", "Comercial Brasil S.A.", "23.456.789/0001-01", "Campinas - SP", "(19) 3333-2000"),
            ("F003", "Mundo Digital ME", "34.567.890/0001-12", "Sumaré - SP", "(19) 3333-3000"),
        ]
        self.associacoes = [
            ("Notebook Lenovo", "Tech Distribuidora Ltda."),
            ("Mouse sem fio", "Tech Distribuidora Ltda."),
            ("Mouse sem fio", "Comercial Brasil S.A."),
            ("Teclado USB", "Mundo Digital ME"),
        ]

        self._style()
        self._header()
        self._tabs()

    def _style(self):
        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure("TNotebook", background="#f3f6fb", borderwidth=0)
        style.configure("TNotebook.Tab", padding=(22, 12), font=("Segoe UI", 10, "bold"))
        style.configure("Treeview", rowheight=30, font=("Segoe UI", 9), background="white")
        style.configure("Treeview.Heading", font=("Segoe UI", 9, "bold"), background="#e8eef8")
        style.map("Treeview", background=[("selected", "#d8e7ff")])
        style.configure("TButton", font=("Segoe UI", 9, "bold"), padding=8)

    def _header(self):
        header = tk.Frame(self, bg="#173b70", height=105)
        header.pack(fill="x")
        header.pack_propagate(False)

        tk.Label(
            header, text="PROJETO INTEGRADOR",
            bg="#173b70", fg="white",
            font=("Segoe UI", 19, "bold")
        ).pack(anchor="w", padx=28, pady=(18, 2))

        tk.Label(
            header, text="Sistema de demonstração • Gestão de produtos e fornecedores",
            bg="#173b70", fg="#dce8fa",
            font=("Segoe UI", 10)
        ).pack(anchor="w", padx=30)

    def _tabs(self):
        content = tk.Frame(self, bg="#f3f6fb", padx=24, pady=20)
        content.pack(fill="both", expand=True)

        self.notebook = ttk.Notebook(content)
        self.notebook.pack(fill="both", expand=True)

        self._product_tab()
        self._supplier_tab()
        self._association_tab()

        footer = tk.Label(
            self,
            text="Protótipo demonstrativo em Python — dados fictícios para fins acadêmicos",
            bg="#f3f6fb", fg="#64748b", font=("Segoe UI", 8)
        )
        footer.pack(pady=(0, 10))

    def _section_title(self, parent, title, subtitle):
        tk.Label(parent, text=title, bg="white", fg="#173b70",
                 font=("Segoe UI", 16, "bold")).pack(anchor="w", padx=20, pady=(18, 3))
        tk.Label(parent, text=subtitle, bg="white", fg="#64748b",
                 font=("Segoe UI", 9)).pack(anchor="w", padx=20, pady=(0, 14))

    def _make_tab_frame(self, name):
        frame = tk.Frame(self.notebook, bg="white")
        self.notebook.add(frame, text=name)
        return frame

    def _tree(self, parent, columns, headings, widths):
        wrap = tk.Frame(parent, bg="white")
        wrap.pack(fill="both", expand=True, padx=20, pady=(5, 20))
        tree = ttk.Treeview(wrap, columns=columns, show="headings")
        for col, heading, width in zip(columns, headings, widths):
            tree.heading(col, text=heading)
            tree.column(col, width=width, anchor="w")
        yscroll = ttk.Scrollbar(wrap, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=yscroll.set)
        tree.pack(side="left", fill="both", expand=True)
        yscroll.pack(side="right", fill="y")
        return tree

    def _product_tab(self):
        tab = self._make_tab_frame("Produtos")
        self._section_title(tab, "Cadastro de Produtos",
                            "Consulte os produtos cadastrados e visualize seus principais dados.")

        form = tk.Frame(tab, bg="#f5f8fc", padx=14, pady=12)
        form.pack(fill="x", padx=20, pady=(0, 10))

        fields = [
            ("Código", "P004"), ("Nome do produto", "Monitor LED"),
            ("Descrição", "Monitor 24 polegadas"), ("Preço", "R$ 899,90"),
            ("Código de barras", "789000000004")
        ]
        for i, (label, value) in enumerate(fields):
            col = i % 3
            row = i // 3
            cell = tk.Frame(form, bg="#f5f8fc")
            cell.grid(row=row, column=col, sticky="ew", padx=6, pady=5)
            tk.Label(cell, text=label, bg="#f5f8fc", fg="#334155",
                     font=("Segoe UI", 8, "bold")).pack(anchor="w")
            entry = ttk.Entry(cell)
            entry.insert(0, value)
            entry.pack(fill="x", pady=(3, 0))
        for col in range(3):
            form.grid_columnconfigure(col, weight=1)

        actions = tk.Frame(tab, bg="white")
        actions.pack(fill="x", padx=20, pady=(0, 5))
        ttk.Button(actions, text="Novo produto", command=lambda: self._info("Novo produto")).pack(side="left", padx=(0, 8))
        ttk.Button(actions, text="Editar selecionado", command=lambda: self._info("Editar produto")).pack(side="left", padx=8)
        ttk.Button(actions, text="Excluir selecionado", command=lambda: self._info("Excluir produto")).pack(side="left", padx=8)

        self.product_tree = self._tree(
            tab, ("codigo", "nome", "descricao", "preco", "barcode"),
            ("Código", "Produto", "Descrição", "Preço", "Código de barras"),
            (80, 190, 230, 110, 160)
        )
        for row in self.produtos:
            self.product_tree.insert("", "end", values=row)

    def _supplier_tab(self):
        tab = self._make_tab_frame("Fornecedores")
        self._section_title(tab, "Cadastro de Fornecedores",
                            "Consulte os fornecedores e seus dados de identificação e contato.")

        form = tk.Frame(tab, bg="#f5f8fc", padx=14, pady=12)
        form.pack(fill="x", padx=20, pady=(0, 10))

        fields = [
            ("Código", "F004"), ("Nome", "Fornecedor Exemplo Ltda."),
            ("CNPJ", "45.678.901/0001-23"), ("Endereço", "Rua das Empresas, 100"),
            ("Contato", "(11) 4000-4000")
        ]
        for i, (label, value) in enumerate(fields):
            col = i % 3
            row = i // 3
            cell = tk.Frame(form, bg="#f5f8fc")
            cell.grid(row=row, column=col, sticky="ew", padx=6, pady=5)
            tk.Label(cell, text=label, bg="#f5f8fc", fg="#334155",
                     font=("Segoe UI", 8, "bold")).pack(anchor="w")
            entry = ttk.Entry(cell)
            entry.insert(0, value)
            entry.pack(fill="x", pady=(3, 0))
        for col in range(3):
            form.grid_columnconfigure(col, weight=1)

        actions = tk.Frame(tab, bg="white")
        actions.pack(fill="x", padx=20, pady=(0, 5))
        ttk.Button(actions, text="Novo fornecedor", command=lambda: self._info("Novo fornecedor")).pack(side="left", padx=(0, 8))
        ttk.Button(actions, text="Editar selecionado", command=lambda: self._info("Editar fornecedor")).pack(side="left", padx=8)
        ttk.Button(actions, text="Excluir selecionado", command=lambda: self._info("Excluir fornecedor")).pack(side="left", padx=8)

        self.supplier_tree = self._tree(
            tab, ("codigo", "nome", "cnpj", "endereco", "contato"),
            ("Código", "Fornecedor", "CNPJ", "Endereço", "Contato"),
            (80, 210, 155, 210, 135)
        )
        for row in self.fornecedores:
            self.supplier_tree.insert("", "end", values=row)

    def _association_tab(self):
        tab = self._make_tab_frame("Associação")
        self._section_title(tab, "Associação Produto / Fornecedor",
                            "Visualize quais fornecedores estão relacionados a cada produto.")

        panel = tk.Frame(tab, bg="#f5f8fc", padx=16, pady=14)
        panel.pack(fill="x", padx=20, pady=(0, 12))

        tk.Label(panel, text="Produto", bg="#f5f8fc", fg="#334155",
                 font=("Segoe UI", 8, "bold")).grid(row=0, column=0, sticky="w", padx=6)
        product_combo = ttk.Combobox(panel, state="readonly", values=[p[1] for p in self.produtos])
        product_combo.set(self.produtos[0][1])
        product_combo.grid(row=1, column=0, sticky="ew", padx=6, pady=(4, 0))

        tk.Label(panel, text="Fornecedor", bg="#f5f8fc", fg="#334155",
                 font=("Segoe UI", 8, "bold")).grid(row=0, column=1, sticky="w", padx=6)
        supplier_combo = ttk.Combobox(panel, state="readonly", values=[f[1] for f in self.fornecedores])
        supplier_combo.set(self.fornecedores[0][1])
        supplier_combo.grid(row=1, column=1, sticky="ew", padx=6, pady=(4, 0))

        panel.grid_columnconfigure(0, weight=1)
        panel.grid_columnconfigure(1, weight=1)
        ttk.Button(
            panel, text="Associar produto ao fornecedor",
            command=lambda: self._info("Associação")
        ).grid(row=1, column=2, padx=10, pady=(4, 0))

        tk.Label(tab, text="Associações cadastradas", bg="white", fg="#173b70",
                 font=("Segoe UI", 11, "bold")).pack(anchor="w", padx=20, pady=(5, 0))

        self.association_tree = self._tree(
            tab, ("produto", "fornecedor"),
            ("Produto", "Fornecedor"), (400, 400)
        )
        for row in self.associacoes:
            self.association_tree.insert("", "end", values=row)

        actions = tk.Frame(tab, bg="white")
        actions.pack(fill="x", padx=20, pady=(0, 16))
        ttk.Button(actions, text="Remover associação selecionada",
                   command=lambda: self._info("Remover associação")).pack(side="left")

    def _info(self, action):
        messagebox.showinfo(
            "Demonstração",
            f"Ação ilustrativa: {action}.\n\n"
            "Esta versão apresenta telas estáticas com dados de exemplo. "
            "As operações ainda não estão conectadas a um banco de dados ou API."
        )


if __name__ == "__main__":
    app = ProjetoIntegradorApp()
    app.mainloop()
