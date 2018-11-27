.PHONY: clean-pyc init help test-ci
.DEFAULT_GOAL := help

help: ## See what commands are available.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36mmake %-15s\033[0m # %s\n", $$1, $$2}'

init: clean-pyc ## Install dependencies and initialise for development.
	pip install --upgrade pip
	pip install -e '.[testing,docs]' -U

lint: ## Lint the project.
	flake8 markov_draftjs tests example.py setup.py
	isort --check-only --diff --recursive markov_draftjs tests example.py setup.py
	npm run lint

test: ## Test the project.
	python -m unittest discover
	npm run test

test-coverage: ## Run the tests while generating test coverage data.
	coverage run -m unittest discover && coverage report && coverage html
	npm run test:coverage

test-ci: ## Continuous integration test suite.
	tox

dev: ## Runs the example code
	python example.py

clean-pyc: ## Remove Python file artifacts.
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +

publish: ## Publishes a new version to pypi
	rm dist/* && python setup.py sdist && twine upload dist/* && echo 'Success! Go to https://pypi.python.org/pypi/markov_draftjs and check that all is well.'
