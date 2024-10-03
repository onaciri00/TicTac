FROM python:3.11


RUN apt-get update && apt-get install -y postgresql-client

#delete and find better
# RUN apt-get update && apt-get install -y \
#     libpq-dev \
#     gcc \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip


WORKDIR /xo_game

COPY requirements.txt .

COPY entrypoint.sh .


RUN pip install --no-cache-dir -r requirements.txt

COPY . .



RUN chmod +x entrypoint.sh

EXPOSE 8001

ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8001"]

