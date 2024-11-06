# Generated by Django 4.2.10 on 2024-08-08 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oauth', '0002_user_info_firstname_user_info_lastname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user_info',
            name='full_name',
        ),
        migrations.AddField(
            model_name='user_info',
            name='fullname',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]