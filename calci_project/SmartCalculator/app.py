from flask import Flask, render_template, request, jsonify
import ast
import math
import operator

app = Flask(__name__)


# =========================================================
# SAFE CALCULATOR
# =========================================================

def safe_calculate(expression):
    """
    Safely calculate mathematical expressions.
    Does not use eval().
    """

    expression = expression.replace("^", "**")

    # Allowed mathematical functions
    allowed_functions = {
        "sin": lambda x: math.sin(math.radians(x)),
        "cos": lambda x: math.cos(math.radians(x)),
        "tan": lambda x: math.tan(math.radians(x)),
        "sqrt": math.sqrt,
        "log": math.log10,
        "ln": math.log,
        "factorial": math.factorial,
        "abs": abs
    }

    allowed_names = {
        "pi": math.pi,
        "e": math.e
    }

    allowed_operators = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.Mod: operator.mod,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos
    }

    def evaluate(node):

        # Number
        if isinstance(node, ast.Constant):

            if isinstance(node.value, (int, float)):
                return node.value

            raise ValueError("Invalid value")


        # Mathematical operators
        elif isinstance(node, ast.BinOp):

            left = evaluate(node.left)
            right = evaluate(node.right)

            operation = allowed_operators.get(type(node.op))

            if operation is None:
                raise ValueError("Operator not allowed")

            return operation(left, right)


        # +number / -number
        elif isinstance(node, ast.UnaryOp):

            operation = allowed_operators.get(type(node.op))

            if operation is None:
                raise ValueError("Operator not allowed")

            return operation(evaluate(node.operand))


        # Function calls
        elif isinstance(node, ast.Call):

            if not isinstance(node.func, ast.Name):
                raise ValueError("Invalid function")

            function_name = node.func.id

            if function_name not in allowed_functions:
                raise ValueError("Function not allowed")

            if len(node.args) != 1:
                raise ValueError("Function requires one value")

            value = evaluate(node.args[0])

            # factorial must use integer
            if function_name == "factorial":

                if value < 0 or value != int(value):
                    raise ValueError(
                        "Factorial requires a non-negative integer"
                    )

                value = int(value)

            return allowed_functions[function_name](value)


        # pi, e
        elif isinstance(node, ast.Name):

            if node.id in allowed_names:
                return allowed_names[node.id]

            raise ValueError("Name not allowed")


        # Parentheses
        elif isinstance(node, ast.Expression):

            return evaluate(node.body)


        else:

            raise ValueError("Invalid expression")


    tree = ast.parse(expression, mode="eval")

    result = evaluate(tree)

    if not math.isfinite(result):
        raise ValueError("Invalid mathematical result")

    return result


# =========================================================
# PAGES
# =========================================================

@app.route("/")
def home():

    return render_template("index.html")


@app.route("/normal")
def normal():

    return render_template("normal.html")


@app.route("/scientific")
def scientific():

    return render_template("scientific.html")


# =========================================================
# CALCULATION API
# =========================================================

@app.route("/calculate", methods=["POST"])
def calculate():

    try:

        data = request.get_json()

        expression = data.get("expression", "")

        if not expression:
            return jsonify({
                "success": False,
                "error": "No expression provided"
            }), 400


        result = safe_calculate(expression)


        # Remove unnecessary .0
        if isinstance(result, float) and result.is_integer():

            result = int(result)


        return jsonify({
            "success": True,
            "expression": expression,
            "result": result
        })


    except ZeroDivisionError:

        return jsonify({
            "success": False,
            "error": "Cannot divide by zero"
        }), 400


    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 400


# =========================================================
# RUN APPLICATION
# =========================================================

if __name__ == "__main__":

    app.run(debug=True)