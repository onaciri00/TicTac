# Generated by Django 4.2.10 on 2024-08-07 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oauth', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_info',
            name='firstname',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user_info',
            name='lastname',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
